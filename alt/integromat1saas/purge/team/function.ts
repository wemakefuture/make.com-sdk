/* eslint-disable @typescript-eslint/indent */
import * as Imports from '../../../../_SRC/generalFunctionImports';
// eslint-disable-next-line @typescript-eslint/naming-convention
const Integromat = require('../../../../_SRC/integromatApi/integromat.js');
// eslint-disable-next-line @typescript-eslint/naming-convention
const Blueprint = require('../../../../_SRC/integromatApi/blueprint.js');
const { v4: uuidv4 } = require('uuid');
// import axios, { AxiosRequestConfig } from 'axios';

const func = async (req: Imports.CustomHttpRequest) => {
  if (!('apiKey' in req.body && 'host' in req.body && 'teamId' in req.body)) {
    throw new Imports.ValidationError('Please specify apiKey, host and teamId');
  }
  const result = {} as any;

  const { apiKey, host, teamId } = req.body;
  const integromat = new Integromat(apiKey, `https://${host}/api/v2`, teamId);
  await integromat.load();

  // delete scenarios in a team
  if ((req.body.removeScenarios || req.body.completePurge) && req.body.removeScenarios !== false) {
    const scenarios = await integromat.scenarios
      .get({})
      .then((response: any) => response.scenarios)
      .catch((response: any) => console.log(JSON.stringify(response, null, 4)));
    const deleteOperations = [];
    for (const scenario of scenarios) {
      deleteOperations.push(integromat.scenarios.forScenarioId.delete({ scenarioId: scenario.id, confirmed: true }));
    }
    await Promise.all(deleteOperations)
      .then((response) => (result.deletedScenarios = response))
      .catch((response) => console.error(response.response.data));
  }

  // delete folders in a team
  if ((req.body.removeFolders || req.body.completePurge) && req.body.removeFolders !== false) {
    const folders = await integromat.scenariosFolders
      .get({})
      .then((response: any) => response.scenariosFolders)
      .catch((response: any) => console.log(JSON.stringify(response, null, 4)));
    const deleteOperations = [];
    for (const folder of folders) {
      deleteOperations.push(integromat.scenariosFolders.forFolderId.delete({ folderId: folder.id, confirmed: true }));
    }
    await Promise.all(deleteOperations)
      .then((response) => (result.deletedFolders = response))
      .catch((response) => console.error(response.response.data));
  }

  // delete connections in a team
  if ((req.body.removeConnections || req.body.completePurge) && req.body.removeConnections !== false) {
    const connections = await integromat.connections
      .get({})
      .then((response: any) => response.connections)
      .catch((response: any) => console.log(JSON.stringify(response, null, 4)));
    const deleteOperations = [];
    for (const connection of connections) {
      deleteOperations.push(integromat.connections.forConnectionId.delete({ connectionId: connection.id, confirmed: true }));
    }
    await Promise.all(deleteOperations)
      .then((response) => (result.deletedConnections = response))
      .catch((response) => console.error(response.response.data));
  }

  // delete webhooks in a team
  if ((req.body.removeHooks || req.body.completePurge) && req.body.removeHooks !== false) {
    const hooks = await integromat.hooks
      .get({})
      .then((response: any) => response.hooks)
      .catch((response: any) => console.log(JSON.stringify(response, null, 4)));
    const deleteOperations = [];
    for (const hook of hooks) {
      deleteOperations.push(integromat.hooks.forHookId.delete({ hookId: hook.id, confirmed: true }));
    }
    await Promise.all(deleteOperations)
      .then((response) => (result.deletedHooks = response))
      .catch((response) => console.error(response.response.data));
  }

  return { result };
};

export { func };
