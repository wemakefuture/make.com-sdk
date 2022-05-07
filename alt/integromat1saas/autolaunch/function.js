/* eslint-disable @typescript-eslint/indent */
import * as Imports from '../../../_SRC/generalFunctionImports';
// eslint-disable-next-line @typescript-eslint/naming-convention
const Integromat = require('../../../_SRC/integromatApi/integromat.js');
// eslint-disable-next-line @typescript-eslint/naming-convention
const Blueprint = require('../../../_SRC/integromatApi/blueprint.js');
import { func as checkApiKey } from '../checkapikey/function';

const { v4: uuidv4 } = require('uuid');
import axios, { AxiosRequestConfig } from 'axios';

const func = async (req) => {

  let metaparameters = {
    apiKeys: {
      integromat: "fec3c3fe-a68e-4eca-87e4-995ea17c013c",
      sendgrid: "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",
      airtable: "keyxlbtivr488Hbzc"
    },
    apps: {
      integromat: {
        destinationTeamId: 1962
      },
      airtable: {
        base: "appf55WwyAUn19dUO",
        table: "Contacts"
      }
    }
  }

  let autolaunchBlueprint = {
    sourceTeamId: 173,
    sourceApiKey: "1ed16854-3ae8-4590-867c-30539778345c",
    scenarioIds: [1676, 1679, 1677, 1678]
  }

  async function autolaunch(autolaunchBlueprint, metaparameters) {
    const { scenarioIds, sourceTeamId, sourceApiKey } = autolaunchBlueprint;
    let promises // variable to save promises to use Promise.all() on that list
    // create the connection to Integromat
    let integromatSrc = new Integromat(sourceApiKey, "https://eu1.make.com/api/v2", sourceTeamId)
    let integromatDest = new Integromat(metaparameters.apiKeys.integromat, "https://eu1.make.com/api/v2", metaparameters.apps.integromat.destinationTeamId)
    await Promise.all([
      integromatSrc.load(),
      integromatDest.load()
    ]);

    // create a new folder to put all the newly created scenarios in

    let folderId
    await integromatDest.scenariosFolders.post({ teamId: metaparameters.apps.integromat.destinationTeamId, name: "Autolaunch Folder" })
      .then(response => {
        folderId = response.scenarioFolder.id;
        //console.log(JSON.stringify(response, null, 4))
      })
      .catch(response => console.log(JSON.stringify(response, null, 4)))
    console.log("Folder created with folderId:", folderId)

    // Get the blueprints
    let blueprints = await loadBlueprints(scenarioIds, integromatSrc, integromatDest)

    //////////////////////////////////////////////////////// Add new webhooks
    promises = []
    for (let i = 0; i < blueprints.length; i++) {
      promises.push(blueprints[i].newWebhook())
    }
    await Promise.all(promises).catch(console.error)

    // console.log(blueprints[0].flow.flow)
    // console.log(blueprints[1].flow.flow)
    // console.log(blueprints[2].flow.flow)
    // console.log(blueprints[3].flow.flow)

    ////////////////////////////////////////////////////////////////// create Sendgrid connection
    let newConnectionName;
    newConnectionName = "automationmarket_" + uuidv4();
    let newConnections;
    let newConnectionId;
    console.log("Creating Sendgrid Connection ...")
    await integromatDest.connections.post(
      {
        teamId: 1962,
        accountName: newConnectionName, // ??? the accountname here becomes "name" after creation and the "accountType" becomes "accountName"
        accountType: "sendgrid", // ??? this is quite weird. When I look at the template accountType it says "basic" which is not accepted here
        apiKey: metaparameters.apiKeys.sendgrid,
        inspector: 0
      }
    )
      .then(response => console.log("Connection verified:", response.verified)) // ??? this does not return an Id. Only "verified" : true. Stupid...
      .catch(error => console.log(JSON.stringify(error.response.data, null, 4)))

    newConnections = await integromatDest.connections.get({})
      .then(response => response.connections)
      //.then(response => console.log(JSON.stringify(response, null, 4)))
      .catch(error => console.log(JSON.stringify(error.response.data, null, 4)))
    for (let connection of newConnections) {
      if (connection.name === newConnectionName) {
        newConnectionId = connection.id;
        console.log("New connection id: ", newConnectionId)
        break;
      }
      //else { console.log("Newly created connection not found") }
    }
    // sendgrid 2,1 3,1 
    blueprints[2].flow.flow[1].parameters["__IMTCONN__"] = newConnectionId;
    blueprints[3].flow.flow[1].parameters["__IMTCONN__"] = newConnectionId;

    ///////////////////////////////////////////////////////////////////////////////////create Airtable connection
    newConnectionName = "Airtable_" + uuidv4();
    console.log("Creating Airtable Connection ...")
    await integromatDest.connections.post(
      {
        teamId: 1962,
        accountName: newConnectionName, // ??? the accountname here becomes "name" after creation and the "accountType" becomes "accountName"
        accountType: "airtable2", // ??? this is quite weird. When I look at the template accountType it says "basic" which is not accepted here
        apiToken: metaparameters.apiKeys.airtable,
        inspector: 0
      }
    )
      .then(response => console.log("Connection verified:", response.verified)) // ??? this does not return an Id. Only "verified" : true. Stupid...
      .catch(error => console.log(JSON.stringify(error.response.data, null, 4)))

    newConnections = await integromatDest.connections.get({})
      .then(response => response.connections)
      //.then(response => console.log(JSON.stringify(response, null, 4)))
      .catch(error => console.log(JSON.stringify(error.response.data, null, 4)))
    for (let connection of newConnections) {
      if (connection.name === newConnectionName) {
        newConnectionId = connection.id;
        console.log("New connection id: ", newConnectionId)
        break;
      }
      //else { console.log("Newly created connection not found") }
    }
    // airtable 0,1 1,1 2,0 3,0
    blueprints[0].flow.flow[1].parameters["__IMTCONN__"] = newConnectionId;
    blueprints[1].flow.flow[1].parameters["__IMTCONN__"] = newConnectionId;
    blueprints[2].flow.flow[0].parameters["__IMTCONN__"] = newConnectionId;
    blueprints[3].flow.flow[0].parameters["__IMTCONN__"] = newConnectionId;

    ///////////////////////////////////////////////////////////////////////////////// Create New Scenarios
    for (let i = 0; i < blueprints.length; i++) {
      promises = []
      promises.push(blueprints[i].createNewScenarioFromBlueprint({ folderId, teamId: metaparameters.apps.integromat.destinationTeamId }))
      //await blueprints[i].createNewScenarioFromBlueprint({folderId, teamId:metaparameters.apps.integromat.destinationTeamId}).then(console.log).catch(console.error)
    }
    Promise.all(promises).catch(console.error)

    //blueprints[0].addErrorHandlers("Holger")
    //await blueprints[0].updateBlueprintInScenario()
  }

  async function loadBlueprints(scenarioIds, integromatSrc, integromatDest) {
    let promises = []
    let newBlueprint
    for (let scenarioId of scenarioIds) {
      newBlueprint = new Blueprint(integromatSrc, integromatDest)
      promises.push(newBlueprint.loadViaAPI(scenarioId)) // nice trick
    }
    let blueprints = await Promise.all(promises) // this way all calls are done at the same time
    //.then(console.log)
    return blueprints

  }

  async function loadBlueprintsOld(scenarioIds, teamId, integromat) {
    let blueprints = []
    let newBlueprint
    for (let scenarioId of scenarioIds) {
      newBlueprint = await integromat.scenarios.forScenarioId.blueprint.get({ teamId, scenarioId })
        .then(result => blueprints.push(result))

    }
    return blueprints
    //console.log(JSON.stringify(blueprints,null,4))
  }
  await autolaunch(autolaunchBlueprint, metaparameters)
  return { result: "Sucess!" }
};

export { func };
