/* eslint-disable @typescript-eslint/naming-convention */
import axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as scenarios from './scenarios';
import * as folders from './folders';
import * as queryStringLib from 'query-string';
import * as hooks from './hooks';
import * as connection from './connections';
import * as teams from './teams';
import * as apps from './apps';

interface MakeConfig {
  apiKey: string;
  host: string;
  organizationId: number;
}
// see https://www.make.com/en/api-documentation/pagination-sorting-filtering
export interface BaseMakeRequestParams {
  'cols[]'?: unknown;
  'pg[sortBy]'?: string;
  'pg[offset]'?: number;
  'pg[sortDir]'?: 'asc' | 'desc';
  'pg[limit]'?: number;
}
export interface MakeRequestConfig {
  method: 'get' | 'GET' | 'delete' | 'DELETE' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH';
  path: string;
  queryStringObject?: Record<string, unknown>;
  body?: unknown;
  subContentKeys?: string[];
}

export class Make {
  loaded: boolean;
  utils: Record<string, unknown>;
  config: MakeConfig;
  constructor(config: MakeConfig) {
    this.config = config;
  }

  // ---------------------------- The actual functions --------------------------------------------

  async createHook(params: hooks.CreateHookParams, content: hooks.CreateHookContent): Promise<hooks.CreateHookOutput> {
    return axios(this.generateAxiosRequest(hooks.createHook(params, content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async listHooks(params: hooks.ListHooksParams): Promise<hooks.ListHooksOutput> {
    return axios(this.generateAxiosRequest(hooks.listHooks(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async deleteHook(params: hooks.DeleteHookParams): Promise<hooks.DeleteHookOutput> {
    return axios(this.generateAxiosRequest(hooks.deleteHook(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async enableHook(params: hooks.EnableHookParams): Promise<hooks.EnableHookOutput> {
    return axios(this.generateAxiosRequest(hooks.enableHook(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async disableHook(params: hooks.DisableHookParams): Promise<hooks.DisableHookOutput> {
    return axios(this.generateAxiosRequest(hooks.disableHook(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async getHookDetails(params: hooks.GetHookDetailsParams): Promise<hooks.GetHookDetailsOutput> {
    return axios(this.generateAxiosRequest(hooks.getHookDetails(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  // Scenario

  async getScenarioDetails(params: scenarios.GetScenarioDetailsParams): Promise<scenarios.GetScenarioDetailsOutput> {
    return axios(this.generateAxiosRequest(scenarios.getScenarioDetails(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async listScenarios(params: scenarios.ListScenariosParams): Promise<scenarios.ListScenariosOutput> {
    return axios(this.generateAxiosRequest(scenarios.listScenarios(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async getScenarioBlueprint(params: scenarios.GetScenarioBlueprintParams): Promise<scenarios.GetScenarioBlueprintOutput> {
    return axios(this.generateAxiosRequest(scenarios.getScenarioBlueprint(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async getScenarioTrigger(params: scenarios.GetScenarioTriggerParams): Promise<scenarios.GetScenarioTriggerOutput> {
    return axios(this.generateAxiosRequest(scenarios.getScenarioTrigger(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async listScenarioBlueprints(params: scenarios.ListScenarioBlueprintsParams): Promise<scenarios.ListScenarioBlueprintsOutput> {
    return axios(this.generateAxiosRequest(scenarios.listScenarioBlueprints(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async listScenarioLogs(params: scenarios.ListScenarioLogsParams): Promise<scenarios.ListScenarioLogsOutput> {
    return axios(this.generateAxiosRequest(scenarios.listScenarioLogs(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async getScenarioExecutionLog(params: scenarios.GetScenarioExecutionLogParams): Promise<scenarios.GetScenarioExecutionLogOutput> {
    return axios(this.generateAxiosRequest(scenarios.getScenarioExecutionLog(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async updateScenario(
    params: scenarios.UpdateScenarioParams,
    content: scenarios.UpdateScenarioContent,
  ): Promise<scenarios.UpdateScenarioOutput> {
    return axios(this.generateAxiosRequest(scenarios.updateScenario(params, content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async createScenario(content: scenarios.CreateScenarioContent): Promise<scenarios.CreateScenarioOutput> {
    return axios(this.generateAxiosRequest(scenarios.createScenario(content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async startScenario(params: scenarios.StartScenarioParams): Promise<scenarios.StartScenarioOutput> {
    return axios(this.generateAxiosRequest(scenarios.startScenario(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async stopScenario(params: scenarios.StopScenarioParams): Promise<scenarios.StopScenarioOutput> {
    return axios(this.generateAxiosRequest(scenarios.stopScenario(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async cloneScenario(
    params: scenarios.CloneScenarioParams,
    content: scenarios.CloneScenarioContent,
  ): Promise<scenarios.CloneScenarioOutput> {
    return axios(this.generateAxiosRequest(scenarios.cloneScenario(params, content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async deleteScenario(params: scenarios.DeleteScenarioParams): Promise<scenarios.DeleteScenarioOutput> {
    return axios(this.generateAxiosRequest(scenarios.deleteScenario(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async createFolder(content: folders.CreateFolderContent): Promise<folders.CreateFolderOutput> {
    return axios(this.generateAxiosRequest(folders.createFolder(content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async deleteFolder(params: folders.DeleteFolderParams): Promise<folders.DeleteFolderOutput> {
    return axios(this.generateAxiosRequest(folders.deleteFolder(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async updateFolder(params: folders.UpdateFolderParams, content: folders.UpdateFolderContent): Promise<folders.UpdateFolderOutput> {
    return axios(this.generateAxiosRequest(folders.updateFolder(params, content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async listFolders(params: folders.ListFoldersParams): Promise<folders.ListFoldersOutput> {
    return axios(this.generateAxiosRequest(folders.listFolders(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  // Connection

  async createConnection(
    params: connection.CreateConnectionParams,
    content: connection.CreateConnectionContent | connection.CreateConnectionContentApiKey,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    return axios(this.generateAxiosRequest(connection.createConnection(params, content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async testConnection(params: connection.TestConnectionParams): Promise<connection.TestConnectionOutput> {
    return new Promise((resolve, reject) => {
      axios(this.generateAxiosRequest(connection.testConnection(params)))
        .then(
          (response) => {
            resolve(response.data as connection.TestConnectionOutput);
          },
          (err) => {
            reject(err);
          },
        )
        .catch((err) => {
          reject(err);
        });
    });
  }

  async scopedConnection(
    params: connection.ScopedConnectionParams,
    content: connection.ScopedConnectionContent,
  ): Promise<connection.ScopedConnectionOutput> {
    return axios(this.generateAxiosRequest(connection.scopedConnection(params, content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async setDataConnection(
    params: connection.SetDataConnectionParams,
    content: connection.SetDataConnectionContent,
  ): Promise<connection.SetDataConnectionOutput> {
    return axios(this.generateAxiosRequest(connection.setDataConnection(params, content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async updateConnection(
    params: connection.UpdateConnectionParams,
    content: connection.UpdateConnectionContent,
  ): Promise<connection.UpdateConnectionOutput> {
    return axios(this.generateAxiosRequest(connection.updateConnection(params, content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async listConnection(params: connection.ListConnectionParams): Promise<connection.ListConnectionOutput> {
    return new Promise((resolve, reject) => {
      return axios(this.generateAxiosRequest(connection.listConnection(params)))
        .then(
          (response) => {
            resolve(response.data as connection.ListConnectionOutput);
          },
          (err) => {
            reject(err);
          },
        )
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getConnectionDetails(params: connection.GetConnectionDetailsParams): Promise<connection.GetConnectionDetailsOutput> {
    return axios(this.generateAxiosRequest(connection.getConnectionDetails(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async deleteConnection(params: connection.DeleteConnectionParams): Promise<connection.DeleteConnectionOutput> {
    return axios(this.generateAxiosRequest(connection.deleteConnection(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  //  Teams
  async listTeams(params: teams.ListTeamsParams): Promise<teams.ListTeamsOutput> {
    return axios(this.generateAxiosRequest(teams.listTeams(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  // Invites
  async appInvite(params: apps.AppInviteParams, content: apps.AppInviteContent): Promise<apps.AppInviteOutput> {
    return axios(this.generateAxiosRequest(apps.appInvite(params, content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  // Apps
  async createApp(content: apps.CreateAppContent): Promise<apps.CreateAppOutput> {
    return axios(this.generateAxiosRequest(apps.createApp(content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async listApps(): Promise<apps.ListAppsOutput> {
    return axios(this.generateAxiosRequest(apps.listApps())).catch(this.handleErrors).then(this.getData);
  }

  async getAppSection(params: apps.GetAppSectionParams): Promise<apps.GetAppSectionOutput> {
    return axios(this.generateAxiosRequest(apps.getAppSection(params)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  async updateAppSection(params: apps.UpdateAppSectionParams, content: apps.UpdateAppSectionContent): Promise<apps.UpdateAppSectionOutput> {
    return axios(this.generateAxiosRequest(apps.updateAppSection(params, content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  // Modules
  async createModule(params: apps.CreateModuleParams, content: apps.CreateModuleContent): Promise<apps.CreateModuleOutput> {
    return axios(this.generateAxiosRequest(apps.createModule(params, content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  // AppConnections
  async createAppConnection(
    params: apps.CreateAppConnectionParams,
    content: apps.CreateAppConnectionContent,
  ): Promise<apps.CreateAppConnectionOutput> {
    return axios(this.generateAxiosRequest(apps.createAppConnection(params, content)))
      .catch(this.handleErrors)
      .then(this.getData);
  }

  // ---------------------------- Helper functions --------------------------------------------

  generateAxiosRequest = (makeRequestConfig: MakeRequestConfig): AxiosRequestConfig => {
    const queryString = makeRequestConfig.queryStringObject ? queryStringLib.stringify(makeRequestConfig.queryStringObject) : undefined;
    const axiosRequestConfig: AxiosRequestConfig = {
      url: 'https://' + this.config.host + '/api/v2' + makeRequestConfig.path + '?' + queryString,
      method: makeRequestConfig.method,
      headers: {
        'content-type': 'application/json',
        Authorization: 'Token ' + this.config.apiKey,
      },
      data: makeRequestConfig.body ? makeRequestConfig.body : {},
    };
    return axiosRequestConfig;
  };
  handleErrors(error: AxiosError): void {
    console.error(error);
    if (error.response) {
      console.error(JSON.stringify(error.response.data));
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSubContent(response: AxiosResponse, subContent?: string[]): any {
    if (typeof subContent === 'undefined') {
      return response.data;
    }
    let output = response.data;
    for (let i = 0; i < subContent.length; i++) {
      output = output[subContent[i]];
    }
    return output;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getData(response: AxiosResponse | void): any {
    if (typeof response === 'undefined') {
      return;
    }
    return response.data;
  }
}

export default Make;
