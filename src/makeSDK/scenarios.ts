import { BaseMakeRequestParams, MakeRequestConfig } from './make';

export interface ListScenariosParams extends BaseMakeRequestParams {
  organizationId: number;
}

// Generated by https://quicktype.io

export interface ListScenariosOutput {
  scenarios: Scenario[];
  pg: PG;
}

export interface PG {
  sortBy: string;
  limit: number;
  sortDir: string;
  offset: number;
}

export interface Scenario {
  id: number;
  name: string;
  teamId: number;
  hookId: number;
  deviceId: null;
  deviceScope: null;
  concept: boolean;
  description: string;
  folderId: number | null;
  isinvalid: boolean;
  islinked: boolean;
  islocked: boolean;
  isPaused: boolean;
  usedPackages: string[];
  lastEdit: string;
  scheduling: Scheduling;
  iswaiting: boolean;
  dlqCount: number;
  createdByUser: null;
  updatedByUser: null;
}

export interface Scheduling {
  type: string;
}

export function listScenarios(params: ListScenariosParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: '/scenarios',
    queryStringObject: { ...params },
    // subContentKeys: ['scenarios'],
  };
  return requestConfig;
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface GetScenarioBlueprintParams {
  scenarioId: number;
}

// Generated by https://quicktype.io

export interface GetScenarioBlueprintOutput {
  code: string;
  response: Response;
}
import { BlueprintType } from '../blueprint';

export interface Response {
  blueprint: BlueprintType;
  scheduling: Scheduling;
  concept: boolean;
  idSequence: number;
  created: string;
  last_edit: string;
}

export function getScenarioBlueprint(params: GetScenarioBlueprintParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: `/scenarios/${params.scenarioId}/blueprint`,
    queryStringObject: {},
    // subContentKeys: ['scenarios'],
  };
  return requestConfig;
}
