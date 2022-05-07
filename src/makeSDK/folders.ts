import { BaseMakeRequestParams, MakeRequestConfig } from './make';

export interface CreateFolderParams extends BaseMakeRequestParams {
  teamId: number;
  name: string;
}

// Generated by https://quicktype.io

export interface CreateFolderOutput {
  scenarioFolder: ScenarioFolder;
}

export interface ScenarioFolder {
  id: number;
  name: string;
  scenariosTotal: number;
}

export function createFolder(params: CreateFolderParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: '/scenarios-folders',
    body: params,
  };
  return requestConfig;
}
