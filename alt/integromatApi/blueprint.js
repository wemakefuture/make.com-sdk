'use strict';
// eslint-disable-next-line @typescript-eslint/naming-convention
const Graph = require('graphology');
const fs = require('fs').promises;

class Blueprint {
  constructor(integromat, integromatDest) {
    this.integromat = integromat;
    this.integromatDest = integromatDest;
    this.init = false;
    this.graph = new Graph.DirectedGraph({ multi: false, allowSelfLoops: false });
    this.ids = [];
  }

  async loadViaAPI(scenarioId) {
    // this.teamId = teamId;
    this.scenarioId = scenarioId;
    // this.rootEndpoint = rootEndpoint;
    // this.integromat = new Integromat(APIkey, rootEndpoint)
    if (!this.integromat.loaded) {
      await this.integromat.load();
    }

    this.blueprint = await this.integromat.scenarios.forScenarioId.blueprint
      .get({
        // teamId: this.teamId, not needed as the scenarioId is global
        scenarioId: this.scenarioId,
      })
      // .then(res => res.response.blueprint)
      .catch((error) => console.log(error.message));
    if (this.blueprint.response.blueprint) {
      this.flow = this.blueprint.response.blueprint;
      this.name = this.flow.name;
    }
    await this.buildGraph();
    return this;
  }

  async loadFromFile(fileName) {
    const data = await fs.readFile(`./exampleData/blueprints/${fileName}`);
    this.flow = JSON.parse(data);
    this.name = this.flow.name;
    this.fileName = fileName;
  }

  getNewId() {
    this.ids.sort(function (a, b) {
      return a - b;
    });
    for (let i = 0; i < this.ids.length; i++) {
      if (i == this.ids.length - 1) {
        // last run and no holes have been found
        return this.ids[i] + 1;
      }
      if (this.ids[i + 1] - this.ids[i] > 1) {
        return this.ids[i] + 1;
      }
    }
  }

  exportToFile(fileName) {
    if (fileName) {
      this.fileName = fileName;
    }
    fs.writeFile(`./blueprints/${this.fileName}.json`, JSON.stringify(this.flow), function (err) {
      if (err) {
        return console.log(err);
      }
    });
  }

  async updateBlueprintInScenario() {
    await this.integromat.scenarios.forScenarioId
      .patch({
        scenarioId: this.scenarioId,
        blueprint: JSON.stringify(this.flow),
        name: this.name,
      })
      .then(console.log('Blueprint successfully updated'))
      .catch((error) => console.log('###', error));
  }

  async createNewScenarioFromBlueprint(vars) {
    await this.integromatDest.scenarios
      .post({
        blueprint: JSON.stringify(this.flow),
        scheduling: '{"type":"indefinitely","interval":900}',
        teamId: 1962,
        concept: false,
        ...vars,
      })
      .then(console.log('Blueprint successfully updated'))
      .catch((error) => console.log(error.response.data));
  }

  async addErrorHandlers(errorHanderParams, blueprint = this.flow) {
    // console.log(JSON.stringify(this.blueprint,null,4))
    for (let i = 0; i < blueprint.flow.length; i++) {
      if (blueprint.flow[i].module === 'builtin:BasicRouter') {
        // this means that there can be more than one child ;-)
        for (let routerIndex = 0; routerIndex < blueprint.flow[i].routes.length; routerIndex++) {
          // now we call this function again with the subroute of each child
          this.addErrorHandlers(errorHanderParams, blueprint.flow[i].routes[routerIndex]);
        }
        return;
      }
      if (true) {
        // blueprint.flow[i].onerror == undefined) {
        // console.log(blueprint.flow[i].module + " does not have an error handler")
        const newId = this.getNewId();
        this.ids.push(newId);

        const errorHandlerCode = `[
                  {
                      "id": ${newId},
                      "module": "app#errorhandler-dpgcf8:errorhandler",
                      "version": 1,
                      "parameters": {
                          "limit": 2,
                          "__IMTCONN__": ${errorHanderParams.connectionId}
                      },
                      "mapper": {
                          "developer": "${errorHanderParams.developer}",
                          "errorCode": "${errorHanderParams.errorCode ?? 400}",
                          "module_name": "${blueprint.flow[i].id}:${blueprint.flow[i].module}",
                          "scenario_name": "${this.flow.name}",
                          "scenario_number": "${this.scenarioId}",
                          "level": ${errorHanderParams.level ?? 1},
                          "message": "Error in Scenario ${this.scenarioId} and module ${blueprint.flow[i].id}:${blueprint.flow[i].module}."
                      },
                      "metadata": {
                          "designer": {
                              "x": ${blueprint.flow[i].metadata.designer.x + 120},
                              "y": ${blueprint.flow[i].metadata.designer.y + 120}
                          },
                          "restore": {
                              "level": {
                                  "mode": "chose",
                                  "label": ""
                              },
                              "__IMTCONN__": {
                                  "label": "My {} connection"
                              }
                          },
                          "parameters": [
                              {
                                  "name": "__IMTCONN__",
                                  "type": "account",
                                  "label": "Connection",
                                  "required": true
                              },
                              {
                                  "name": "limit",
                                  "type": "uinteger",
                                  "label": "Limit",
                                  "required": true
                              }
                          ],
                          "expect": [
                              {
                                  "name": "scenario_name",
                                  "type": "text",
                                  "label": "Scenario Name",
                                  "required": true
                              },
                              {
                                  "name": "scenario_number",
                                  "type": "text",
                                  "label": "Scenario Number",
                                  "required": true
                              },
                              {
                                  "name": "module_name",
                                  "type": "text",
                                  "label": "Module Name",
                                  "required": true
                              },
                              {
                                  "name": "developer",
                                  "type": "text",
                                  "label": "Developer",
                                  "required": true
                              },
                              {
                                  "name": "errorCode",
                                  "type": "number",
                                  "label": "Error Code"
                              },
                              {
                                  "name": "message",
                                  "type": "text",
                                  "label": "Error Message"
                              },
                              {
                                  "name": "level",
                                  "type": "select",
                                  "label": "Error Level",
                                  "validate": {
                                      "enum": [
                                          1,
                                          2,
                                          3,
                                          4
                                      ]
                                  }
                              }
                          ]
                      }
                  }
              ]
                `;
        // console.log(errorHandlerCode)
        blueprint.flow[i].onerror = JSON.parse(errorHandlerCode);
      }
    }
    // console.log(JSON.stringify(this.blueprint, null, 4))
  }

  async buildGraph(blueprint = this.flow, structure = [0], previousNode = null) {
    // This function is recursive to traverse the "tree", Standard values are for the first run
    if (previousNode === null) {
      // That means only in the first run
      this.graph.setAttribute('name', this.flow.name);
    }
    // Go through each module
    blueprint.flow.forEach((module) => {
      this.ids.push(module.id);
      if (module.onerror) {
        this.ids.push(module.onerror[0].id);
      }
      // collect the attributes that shall be saved in an object
      const attributes = { moduleID: module.id, module: module.module };
      if (module.metadata.designer.name) {
        attributes.name = module.metadata.designer.name;
      }
      if (module?.filter?.name) {
        attributes.filter = module.filter.name;
      }
      // define the node name according to the structure and the module name
      const nodeName = `${this.graphStructureNumbersToString(structure)}${attributes.module}`;

      if (previousNode !== null) {
        // create node AND edge
        const currentNode = this.graph.addNode(nodeName, attributes);
        this.graph.addEdge(previousNode, currentNode);
        if (attributes.filter) {
          this.graph.setEdgeAttribute(previousNode, currentNode, 'filter', attributes.filter);
        }
        previousNode = currentNode;
      } else {
        // create only a node for the first module
        const currentNode = this.graph.addNode(nodeName, attributes);
        previousNode = currentNode;
      }

      if (module.module === 'builtin:BasicRouter') {
        // this means that there can be more than one child ;-)
        structure.push(0);
        for (let childIndex = 0; childIndex < module.routes.length; childIndex++) {
          const newStructure = JSON.parse(JSON.stringify(structure)); // deep copy instead of structure.slice(0); (shallow copy)
          newStructure[newStructure.length - 1] = childIndex;
          // now we call this function again with the subroute of each child
          this.buildGraph(module.routes[childIndex], newStructure, previousNode);
        }
      }
      structure.push(0); // after one loop we go deeper one step into the graph which shall also be resembled by the node name via the structure liste
    });
  }

  printGraph() {
    if (this.graph === undefined) {
      this.buildGraph();
    }
    console.log(JSON.stringify(this.graph.export(), null, 4));
  }

  getGraphLeaves() {
    if (this.graph === undefined) {
      this.buildGraph();
    }
    const leaves = [];
    for (const key of this.graph.nodes()) {
      if (this.graph.outDegree(key) === 0) {
        leaves.push(key);
      }
    }
    return leaves;
  }

  getGraphPathToRoot(node) {
    const path = [];
    path.push(node);
    while (this.graph.inNeighbors(node)[0] != undefined) {
      const newNode = this.graph.inNeighbors(node)[0];
      path.unshift(newNode);
      node = newNode;
    }
    console.log(path);

    return path;
  }

  addModuleAfter(ID, moduleJSON, blueprint = this.flow) {
    // /////////// adds a module in the blueprint after a module given by the id
    for (let i = 0; i < blueprint.flow.length; i++) {
      if (blueprint.flow[i].module === 'builtin:BasicRouter') {
        // We look recursively in the router paths for the  {}
        for (let routerIndex = 0; routerIndex < blueprint.flow[i].routes.length; routerIndex++) {
          // now we call this function again with the subroute of each child
          this.addModuleAfter(ID, moduleJSON, blueprint.flow[i].routes[routerIndex]);
        }
        return;
      }
      if (blueprint.flow[i].id === ID) {
        // blueprint.flow[i].onerror == undefined) {
        // console.log(blueprint.flow[i].module + " does not have an error handler")
        const newId = this.getNewId();
        this.ids.push(newId);
        // This is where the new module is inserted
        blueprint.flow.splice(id + 1, 0, moduleJSON);
        // ############################################################################## make sure that the ID is also inserted into the JSON.... but how?
      }
    }
    // console.log(JSON.stringify(this.blueprint, null, 4))
  }
  addHTTPtoLeaves() {
    return;
    // each leave in the blueprint gets attached a http module
    const leaves = this.getGraphLeaves();
    for (const leaf of leaves) {
      const requestBody = { exec: [] };
      const pathToRoot = this.getGraphPathToRoot(leaf);
      for (const node of pathToRoot) {
        requestBody.exec.push({ name: node, atributes: this.graph.getNodeAttributes(node) });
      }
      this.addModuleAfter(this.graph.getNodeAttribute(leaf, 'moduleID'), undefined);
    }
  }

  graphStructureNumbersToString(structure) {
    // basically converts an array [0,0,0,0,0,1,0] into a string "0.0.0.0.0.1.0_"
    let resultString = '';
    for (let i = 0; i < structure.length; i++) {
      if (i === structure.length - 1) {
        resultString += structure[i].toString() + '_';
      } else {
        resultString += structure[i].toString() + '.';
      }
    }
    return resultString;
  }

  async newWebhook() {
    if (this.flow.flow[0].module === 'gateway:CustomWebHook') {
      const newHook = await this.integromatDest.hooks
        .post({
          teamId: this.integromatDest.vars.teamId,
          typeName: 'gateway-webhook',
          name: this.flow.flow[0].metadata.restore.hook.label,
          headers: false,
          stringify: false,
          method: false,
        })
        .then((response) => response.hook)
        .catch((error) => console.log(JSON.stringify(error.response.data, null, 4)));

      this.flow.flow[0].parameters.hook = newHook.id;
      console.log('Blueprint updated with new Webhook. Id:', newHook.id);
    } else {
      console.log('Scenario does not start with a webhook.');
    }
  }
}

if (typeof require !== 'undefined' && require.main === module) {
}

module.exports = Blueprint;
