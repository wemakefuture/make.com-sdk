/* eslint-disable @typescript-eslint/no-explicit-any */
import Make, { BaseMakeRequestParams, MakeRequestConfig } from './make';

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

export interface GetScenarioDetailsParams {
  organizationId?: number;
  scenarioId: number;
  folderId?: number;
  islinked?: boolean;
}

export interface GetScenarioDetailsOutput {
  scenario: Scenario;
}

export interface Scheduling {
  type: string;
  interval: number;
}

export function getScenarioDetails(params: GetScenarioDetailsParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: `/scenarios/${params.scenarioId}`,
    queryStringObject: { ...params },
  };
  return requestConfig;
}

export interface GetScenarioTriggerParams {
  blueprintId?: number;
  scenarioId: number;
}
export interface GetScenarioTriggerOutput {
  id: number;
  name: string;
  udid: string;
  scope: string;
  queueCount: number;
  queueLimit: number;
  typeName: string;
  type: string;
  url: string;
}

export function getScenarioTrigger(params: GetScenarioTriggerParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: `/scenarios/${params.scenarioId}/triggers`,
    queryStringObject: { ...params },
  };
  return requestConfig;
}

export interface ListScenarioBlueprintsParams extends BaseMakeRequestParams {
  scenarioId: number;
}

export interface ListScenarioBlueprintsOutput {
  scenariosBlueprints: ScenariosBlueprint[];
}

export interface ScenariosBlueprint {
  created: Date;
  version: number;
  scenarioId: number;
}

export function listScenarioBlueprints(params: ListScenarioBlueprintsParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: `/scenarios/${params.scenarioId}/blueprints`,
    queryStringObject: { ...params },
  };
  return requestConfig;
}

export interface ListScenarioLogsParams extends BaseMakeRequestParams {
  scenarioId: number;
  from?: number;
  to?: number;
  status?: number;
  'pg[last]'?: boolean;
  'pg[showLast]'?: string;
  showCheckRuns?: boolean;
}
export interface ListScenarioLogsOutput {
  scenarioLogs: ScenarioLog[];
  pg: PG;
}

export interface PG {
  sortBy: string;
  sortDir: string;
  limit: number;
  offset: number;
}

export interface ScenarioLog {
  imtId: string;
  id: number | string;
  detail?: Detail;
  authorId: number | null;
  type: string;
  timestamp: Date;
  duration?: number;
  operations?: number;
  transfer?: number;
  teamId?: number;
  instant?: boolean;
  status?: number;
}

export interface Detail {
  author: Author;
}

export interface Author {
  name: string;
  staff: boolean;
}

export function listScenarioLogs(params: ListScenarioLogsParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: `/scenarios/${params.scenarioId}/logs`,
    queryStringObject: { ...params },
  };
  return requestConfig;
}

export interface GetScenarioExecutionLogParams {
  scenarioId: number;
  executionId: string;
}

export interface GetScenarioExecutionLogOutput {
  scenarioLog: ScenarioLog;
}

export interface ScenarioLog {
  organizationId: number;
  '@kindId': number;
}

export function getScenarioExecutionLog(params: GetScenarioExecutionLogParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: `/scenarios/${params.scenarioId}/logs/${params.executionId}`,
  };
  return requestConfig;
}

export interface UpdateScenarioParams {
  scenarioId: number;
  folderId: number;
  blueprint: string;
  name: string;
  scheduling: string;
  concept: boolean;
}

export interface UpdateScenarioOutput {
  scenario: Scenario;
}

export function updateScenario(params: UpdateScenarioParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'patch',
    path: `/scenarios/${params.scenarioId}`,
    body: params,
  };
  return requestConfig;
}

export interface CreateScenarioParams {
  blueprint: string;
  teamId: number;
  scheduling: string;
  concept: boolean;
  folderId: number | null;
  basedon: number;
}
export interface CreateScenarioOutput {
  scenario: Scenario;
}

export function createScenario(params: CreateScenarioParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: '/scenarios',
    body: params,
  };
  return requestConfig;
}

export interface StartScenarioParams {
  scenarioId: number;
}

export interface StartScenarioOutput {
  scenario: Scenario;
}

export function startScenario(params: StartScenarioParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: `/scenarios/${params.scenarioId}/start`,
  };
  return requestConfig;
}

export interface StopScenarioParams {
  scenarioId: number;
}

export interface StopScenarioOutput {
  scenario: Scenario;
}

export function stopScenario(params: StopScenarioParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: `/scenarios/${params.scenarioId}/stop`,
    queryStringObject: { ...params },
  };
  return requestConfig;
}

export interface CloneScenarioParams {
  organizationId: number;
  notAnalyze?: boolean;
  scenarioId: number;
  name: string;
  teamId: number;
  states: boolean;
  account: Record<string, unknown>;
}

export interface CloneScenarioOutput {
  scenario: Scenario;
}

export function cloneScenario(params: CloneScenarioParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: `/scenarios/${params.scenarioId}/clone`,
    queryStringObject: { ...params },
  };
  return requestConfig;
}

export interface GetScenarioBlueprintParams {
  scenarioId: number;
}

// Generated by https://quicktype.io

export interface GetScenarioBlueprintOutput {
  code: string;
  response: Response;
}

export interface Response {
  blueprint: BlueprintType;
  scheduling: Scheduling;
  concept: boolean;
  idSequence: number;
  created: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  last_edit: string;
}

export interface BlueprintType {
  name?: string;
  flow: Module[];
  metadata?: BlueprintTypeMetadata;
}

export interface Module {
  id: number;
  mapper: any;
  module: string;
  onerror?: Module[];
  version: number;
  metadata: any;
  parameters?: any;
  routes?: BlueprintType[]; // if Router
}

export interface BlueprintTypeMetadata {
  instant: boolean;
  version: number;
  scenario: Scenario;
  designer: FluffyDesigner;
  zone?: string;
}

export interface FluffyDesigner {
  orphans: any[];
}

export interface Scenario {
  roundtrips: number;
  maxErrors: number;
  autoCommit: boolean;
  autoCommitTriggerLast: boolean;
  sequential: boolean;
  confidential: boolean;
  dataloss: boolean;
  dlq: boolean;
}

interface ErrorHandlerParams {
  developer: string;
  connectionId: number;
  errorCode?: string;
  level?: number;
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
