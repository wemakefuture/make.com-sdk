/* eslint-disable @typescript-eslint/indent */
import * as Imports from '../../../_SRC/generalFunctionImports';
// eslint-disable-next-line @typescript-eslint/naming-convention
const Integromat = require('../../../_SRC/integromatApi/integromat.js');
// eslint-disable-next-line @typescript-eslint/naming-convention
const Blueprint = require('../../../_SRC/integromatApi/blueprint.js');
import { func as checkApiKey } from '../checkapikey/function';

const { v4: uuidv4 } = require('uuid');
import axios, { AxiosRequestConfig } from 'axios';
import { call } from '@google-cloud/vision/build/src/helpers';

const func = async (req: Imports.CustomHttpRequest) => {
  if (typeof req.body.apiKey === 'undefined') {
    throw new Imports.ValidationError('Please specify an API key');
  }
  else { // Check if the provided API key has the right permission attributes. Those are specified in the checkapi endpoint.
    const requestConfig = {} as Imports.CustomHttpRequest;
    requestConfig.body = { apiKey: req.body.apiKey }
    //await checkApiKey(requestConfig)
  }


  /* if (typeof req.body.scenarioId === 'number') {
  } */
  // We might always need a teamId ?????
  // if (typeof req.body.teamId === 'undefined') {
  //   throw new Imports.ValidationError('Please specify a Team');
  // }
  const convertToNumber = (name: string, value: any) => {
    if (value === undefined || value === "") { return }
    const result = parseInt(value)
    if (isNaN(result)) { throw new Imports.ValidationError(`Please provide a correct value for the parameter "${name}".`) }
    return result
  }

  const connectionData = {
    webhook: req.body.connection?.webhook ?? 'http://www.google.com',
    clientName: req.body.connection?.clientName ?? 'client name',
    accountEmail: req.body.connection?.accountEmail ?? 'undefined@email.com',
    accountNumber: req.body.connection?.accountNumber ?? 123,
    preferExisting: req.body.connection?.preferExisting ?? true,
  };

  // adapting to differnt input formats
  if (req.body.scenarios === "") { req.body.scenarios = undefined }

  req.body.teamId = convertToNumber("teamId", req.body.teamId) // needs to be integer
  req.body.organizationId = convertToNumber("organizationId", req.body.organizationId)
  req.body.level = convertToNumber("level", req.body.level)

  const errorHandlerConfig = {
    organizationId: req.body.organizationId,
    teamId: req.body.teamId,
    apiKey: req.body.apiKey,
    scenarios: req.body.scenarios,
    host: req.body.host ?? 'eu1.make.com',
    developer: req.body.developer ?? 'unknown',
    errorCode: req.body.errorCode ?? 400,
    level: req.body.level ?? 1,
    connection: connectionData ?? null,
  };

  // create a new connection for an error handler
  await findOrCreateErrorHandlerConnection(errorHandlerConfig);

  // export data at the same time as the error handlers are added
  // ### Should not be done via a POST request
  const axiosConfig: AxiosRequestConfig = {
    method: 'POST',
    url: new URL(req.url).origin + '/integromat/exportdata/organization',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      auth: req.apiKey,
    },
    data: {
      teamId: errorHandlerConfig.teamId,
      apiKey: errorHandlerConfig.apiKey,
      host: errorHandlerConfig.host,
      webhook: 'https://hook.eu1.make.com/gm2wdca5sngnbrczfcrtm856kryhod9c',
    },
  };
  // add the error handlers and export the data at the same time
  //await Promise.all([addErrorHandlers(errorHandlerConfig), axios(axiosConfig)]); // .catch(console.log);
  // only add error handler:
  await addErrorHandlers(errorHandlerConfig)
  return { result: 'success' };
};

const addErrorHandlers = async (errorHandlerConfig: any) => {
  let integromat;

  // Here we to check what has been provided.
  // We work on the lowest level possible.
  // That means that when a scenario id is provided as an integer we only add error handlers to that scenario
  // Hirarchy: scenarioId, multiple scenarioIds, teamId, organizationID

  // Only one scenarioId
  if (typeof errorHandlerConfig.scenarios === 'number') {
    // just put the one value into a list to loop over later :-)
    errorHandlerConfig.scenarios = [errorHandlerConfig.scenarios];
  }
  // An array of scenarioIds
  else if (Array.isArray(errorHandlerConfig.scenarios)) {
    const pass = 'do nothing and never use that variable again';
  }
  // teamId is given which automatically adds the error handler only to this team
  else if (typeof errorHandlerConfig.scenarios === 'undefined' && typeof errorHandlerConfig.teamId != 'undefined') {
    integromat = new Integromat(errorHandlerConfig.apiKey, `https://${errorHandlerConfig.host}/api/v2`, errorHandlerConfig.teamId);
    await integromat.load();

    await integromat.scenarios
      .get({ 'pg[limit]': 10000 })
      .then((response: any) => {
        errorHandlerConfig.scenarios = [];
        for (const scenario of response.scenarios) {
          errorHandlerConfig.scenarios.push(scenario.id);
        }
      })
      .catch((response: any) => console.log(JSON.stringify(response, null, 4)));
  }
  // if only the organization ID is given. Let's do it for the whole organization
  else if (typeof errorHandlerConfig.organizationId != 'undefined') {
    integromat = new Integromat(
      errorHandlerConfig.apiKey,
      `https://${errorHandlerConfig.host}/api/v2`,
      undefined,
      errorHandlerConfig.organizationId,
    ); // teamId and organizationId are not allowed at the same time
    await integromat.load();
    // get all the scenarios which are in the organization
    await integromat.scenarios
      .get({ 'pg[limit]': 10000 })
      .then((response: any) => {
        errorHandlerConfig.scenarios = [];
        for (const scenario of response.scenarios) {
          errorHandlerConfig.scenarios.push(scenario.id);
        }
      })
      .catch((response: any) => console.log(JSON.stringify(response, null, 4)));
  } else {
    throw new Imports.ValidationError('Please check whether you have specified the scenarios corretly');
  }

  // This might also happen
  if (errorHandlerConfig.scenarios.length === 0) {
    throw new Imports.ValidationError('No scenarios found or specified');
  }

  // Get the blueprints
  const blueprints = await loadBlueprints(errorHandlerConfig.scenarios, integromat);
  for (const blueprint of blueprints) {
    await blueprint.addErrorHandlers(errorHandlerConfig); // we could perform those requests in a parallel manner
    await blueprint.updateBlueprintInScenario();
  }
};

const loadBlueprints = async (scenarioIds: any, integromat: any) => {
  const promises = [];
  let newBlueprint;
  for (const scenarioId of scenarioIds) {
    newBlueprint = new Blueprint(integromat, integromat);
    promises.push(newBlueprint.loadViaAPI(scenarioId)); // nice trick
  }
  const blueprints = await Promise.all(promises); // this way all calls are done at the same time
  // .then(console.log)
  return blueprints;
};

const findOrCreateErrorHandlerConnection = async (errorHandlerConfig: any) => {
  const integromat = new Integromat(
    errorHandlerConfig.apiKey,
    `https://${errorHandlerConfig.host}/api/v2`,
    errorHandlerConfig.teamId,
    errorHandlerConfig.organizationId,
  );
  await integromat.load();

  if (!(errorHandlerConfig.connection === false) && !errorHandlerConfig.connection.preferExisting) {
    // else create a new connection
    await createErrorHandlerConnection(errorHandlerConfig, integromat);
    console.log('Forcefully Created');
    // no specification of how to create a connection
    return;
  }
  // otherwise look for existing connections
  const callConfig: any = {}
  //if (typeof errorHandlerConfig.teamId !== "undefined") { callConfig.teamId = errorHandlerConfig.teamId }
  //if (typeof errorHandlerConfig.organizationId !== "undefined") { callConfig.organizationId = errorHandlerConfig.organizationId }
  const connections = await integromat.connections
    .get(callConfig)
    .then((result: any) => result.connections)

  if (connections.length === 0) {
    // that means that there are no connections at all
    // So create a new connection
    await createErrorHandlerConnection(errorHandlerConfig, integromat);
  } else {
    // That means we have found a connection but do not know whether it is the right one
    let errorHandlerConnectionFound = false;
    for (const connection of connections) {
      if (connection.packageName === 'app#errorhandler-dpgcf8') {
        errorHandlerConfig.connectionId = connection.id;
        errorHandlerConnectionFound = true;
        break;
      }
    }
    if (!errorHandlerConnectionFound) {
      // Create new connection as noone was found
      await createErrorHandlerConnection(errorHandlerConfig, integromat);
    }
  }
};

const createErrorHandlerConnection = async (errorHandlerConfig: any, integromat: any) => {
  // create new connection
  if (errorHandlerConfig.connection === false) {
    throw new Imports.ManualError(
      'No error handler connections were found. Create them manually or add a configuration object using the coneection key',
    );
  }
  const newConnectionName = 'errorHanderConnection_' + uuidv4();
  await integromat.connections
    .post({
      teamId: errorHandlerConfig.teamId,
      accountName: newConnectionName, // ??? the accountname here becomes "name" after creation and the "accountType" becomes "accountName"
      accountType: 'app#errorhandler-dpgcf8', // ??? this is quite weird. When I look at the template accountType it says "basic" which is not accepted here
      inspector: 0,
      webhook: errorHandlerConfig.connection.webhook,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_name: errorHandlerConfig.connection.clientName,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      account_email: errorHandlerConfig.connection.accountEmail,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      account_number: errorHandlerConfig.connection.accountNumber,
    })
    .then(console.log)
    .catch((result: any) => {
      console.log(result.response.data);
    });

  const connections = await integromat.connections
    .get({})
    .then((response: any) => response.connections)
    // .then(response => console.log(JSON.stringify(response, null, 4)))
    .catch((error: any) => console.log(JSON.stringify(error.response.data, null, 4)));
  for (const connection of connections) {
    if (connection.name === newConnectionName) {
      errorHandlerConfig.connectionId = connection.id;
      console.log('New connection id: ', connection.id);
    }
  }
};

export { func };
