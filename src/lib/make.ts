/* eslint-disable @typescript-eslint/naming-convention */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as scenarios from './scenarios';
import * as folders from './folders';
import * as queryStringLib from 'query-string';
import * as hooks from './hooks';

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
