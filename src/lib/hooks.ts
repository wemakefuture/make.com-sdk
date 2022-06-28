import Make, { BaseMakeRequestParams, MakeRequestConfig } from './make';

export interface CreateHookParams {
  inspector?: number;
}

export interface CreateHookContent {
  name: string;
  teamId: string;
  typeName: string;
  __IMTCONN__: number;
  formId: string;
}

export interface CreateHookOutput {
  hook: Hook;
}

export interface Hook {
  id: number;
  name: string;
  teamId: number;
  udid: string;
  type: string;
  packageName: null;
  theme: string;
  editable: boolean;
  queueCount: number;
  queueLimit: number;
  enabled: boolean;
  gone: boolean;
  typeName: string;
  data: Data;
  url: string;
}

export interface Data {
  __IMTCONN__: number;
  formId: string;
  teamId?: number;
  url: string;
}

export function createHook(params: CreateHookParams, content: CreateHookContent): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: '/hooks',
    queryStringObject: { ...params },
    body: content,
  };
  return requestConfig;
}

export interface ListHooksParams {
  teamId: number;
  typeName: string;
  assigned: boolean;
  viewForScenarioId?: number;
}

export interface ListHooksOutput {
  hooks: Hook[];
}

export interface Hook {
  id: number;
  name: string;
  teamId: number;
  udid: string;
  type: string;
  packageName: null;
  theme: string;
  editable: boolean;
  queueCount: number;
  queueLimit: number;
  enabled: boolean;
  gone: boolean;
  typeName: string;
  data: Data;
  scenarioId: number;
  url: string;
}

export interface Data {
  headers: boolean;
  method: boolean;
  stringify: boolean;
  ip?: null;
  udt?: null;
  teamId?: number;
}

export function listHooks(params: ListHooksParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: '/hooks',
    queryStringObject: { ...params },
  };
  return requestConfig;
}

export interface DeleteHookParams {
  hookId: number;
  confirmed?: boolean;
}

export interface DeleteHookOutput {
  hook: number;
}

export function deleteHook(params: DeleteHookParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'delete',
    path: `/hooks/${params.hookId}`,
    queryStringObject: { ...params },
  };
  return requestConfig;
}

export interface EnableHookParams {
  hookId: number;
}

export interface EnableHookOutput {
  success: boolean;
}

export function enableHook(params: EnableHookParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: `/hooks/${params.hookId}/enable`,
  };
  return requestConfig;
}

export interface DisableHookParams {
  hookId: number;
}

export interface DisableHookOutput {
  success: boolean;
}

export function disableHook(params: DisableHookParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: `/hooks/${params.hookId}/disable`,
  };
  return requestConfig;
}

export interface GetHookDetailsParams {
  hookId: number;
}

export interface GetHookDetailsOutput {
  hook: Hook;
}

export function getHookDetails(params: GetHookDetailsParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: `/hooks/${params.hookId}`,
  };
  return requestConfig;
}
