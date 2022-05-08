/* eslint-disable @typescript-eslint/indent */
import _ from 'lodash';

if (typeof require !== 'undefined' && require.main === module) {
  (async () => {
    // df
    const definitions = [
      {
        folder: 'hooks',
        function: 'createHook',
      },
      {
        folder: 'hooks',
        function: 'listHooks',
      },
      {
        folder: 'hooks',
        function: 'deleteHook',
      },
      {
        folder: 'hooks',
        function: 'enableHook',
      },
      {
        folder: 'hooks',
        function: 'disableHook',
      },
      {
        folder: 'hooks',
        function: 'getHookDetails',
      },
      {
        folder: 'scenarios',
        function: 'getScenarioDetails',
      },
      {
        folder: 'scenarios',
        function: 'listScenarios',
      },
      {
        folder: 'scenarios',
        function: 'getScenarioBlueprint',
      },
      {
        folder: 'scenarios',
        function: 'getScenarioTrigger',
      },
      {
        folder: 'scenarios',
        function: 'listScenarioBlueprints',
      },
      {
        folder: 'scenarios',
        function: 'listScenarioLogs',
      },
      {
        folder: 'scenarios',
        function: 'getScenarioExecutionLog',
      },
      {
        folder: 'scenarios',
        function: 'updateScenario',
      },
      {
        folder: 'scenarios',
        function: 'createScenario',
      },
      {
        folder: 'scenarios',
        function: 'startScenario',
      },
      {
        folder: 'scenarios',
        function: 'stopScenario',
      },
      {
        folder: 'scenarios',
        function: 'cloneScenario',
      },

      {
        folder: 'folders',
        function: 'createFolder',
      },
      {
        folder: 'folders',
        function: 'deleteFolder',
      },
      {
        folder: 'folders',
        function: 'updateFolder',
      },
      {
        folder: 'folders',
        function: 'listFolders',
      },
    ];

    for (const definition of definitions) {
      console.log(
        `
async ${definition.function}(params: ${definition.folder}.${_.upperFirst(definition.function)}Params): Promise<${
          definition.folder
        }.${_.upperFirst(definition.function)}Output> {
    return await axios(this.generateAxiosRequest(${definition.folder}.${
          definition.function
        }(params))).catch(this.handleErrors).then(this.getData);
}        `,
      );
    }
  })();
}
