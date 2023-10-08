import { MakeRequestConfig } from './make';

export interface CreateAppContent {
  name: string;
  label: string;
  theme: string;
  countries: string[];
  language: string;
  audience: string;
  description: string;
  beta?: boolean;
}

export interface CreateAppOutput {
  app: App;
}

export interface ListAppsOutput {
  apps: App[];
}

export interface App {
  name: string;
  label: string;
  theme: string;
  version: number;
  approved: boolean;
  public: boolean;
}

export interface GetAppSectionParams {
  appName: string;
  appVersion: number;
  section: string;
}

// TODO: This is a placeholder, we need to define the output for every section
export interface GetAppSectionOutput {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface UpdateAppSectionOutput {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface UpdateAppSectionParams {
  appName: string;
  appVersion: number;
  section: string;
}

export interface UpdateAppSectionContent {
  baseUrl: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface CreateModuleParams {
  appName: string;
  appVersion: number;
}

export interface CreateModuleContent {
  name: string;
  label: string;
  description: string;
  typeId: number;
  connection: string;
}

export interface CreateModuleOutput {
  appModule: Module;
}

export interface Module {
  name: string;
  label: string;
  description: string;
  typeId: number;
  crud: boolean;
  connection: string;
  webhooks: null | string;
}

export interface CreateAppConnectionParams {
  appName: string;
}

export interface CreateAppConnectionContent {
  name: string;
  type: string;
  label: string;
  required: boolean;
}

export interface CreateAppConnectionOutput {
  appConnection: AppConnection;
}

export interface AppConnection {
  name: string;
  label: string;
  type: string;
}

export interface AppInviteParams {
  appId: string;
  all?: boolean;
  openSource?: boolean;
}

export interface AppInviteContent {
  organizationIds: number;
}

export interface AppInviteOutput {
  appInvite: AppInvite;
}

export interface AppInvite {
  name: string;
  label: string;
  theme: string;
  created: Date;
  access: boolean;
  manifestBasic: ManifestBasic;
  language: string;
}

export interface ManifestBasic {
  icon: string;
  name: string;
  label: string;
  theme: string;
  groups: Group[];
  public: boolean;
  actions: null;
  version: string;
  searches: null;
  triggers: null;
  description: string;
}

export interface Group {
  label: string;
  modules: string[];
}

export function appInvite(params: AppInviteParams, content: AppInviteContent): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: `/sdk/apps/invites/${params.appId}`,
    queryStringObject: { ...params },
    body: content,
  };
  return requestConfig;
}

export function createApp(content: CreateAppContent): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: `/sdk/apps`,
    body: content,
  };
  return requestConfig;
}

export function listApps(): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: `/sdk/apps`,
  };
  return requestConfig;
}

export function getAppSection(params: GetAppSectionParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: `/sdk/apps/${params.appName}/${params.appVersion.toString()}/${params.section}`,
  };
  return requestConfig;
}

export function updateAppSection(params: UpdateAppSectionParams, content: UpdateAppSectionContent): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'put',
    path: `/sdk/apps/${params.appName}/${params.appVersion.toString()}/${params.section}`,
    body: content,
  };
  return requestConfig;
}

export function createModule(params: CreateModuleParams, content: CreateModuleContent): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: `/sdk/apps/${params.appName}/${params.appVersion.toString()}/modules`,
    body: content,
  };
  return requestConfig;
}

export function createAppConnection(params: CreateAppConnectionParams, content: CreateAppConnectionContent): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: `/sdk/apps/${params.appName}/connections`,
    body: content,
  };
  return requestConfig;
}
