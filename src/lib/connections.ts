import { MakeRequestConfig } from './make';

export interface CreateConnectionParams {
  teamId: number;
  inspector: number;
}

export interface CreateConnectionContentApiKey {
  accountName: string;
  accountType: string;
  apiKey: string;
}

export interface CreateConnectionContent {
  accountName: string;
  accountType: string;
  consumerKey: string;
  consumerSecret: string;
  scopes: string[];
}

export interface CreateConnectionOutput {
  connection: Connection;
}

export interface Connection {
  id: number;
  name: string;
  accountName: string;
  accountLabel: null | string;
  packageName: null | string;
  expire: null;
  metadata: null | Metadata;
  teamId: number;
  theme: string;
  upgradeable: boolean;
  scopes: number | Scope[];
  scoped: boolean;
  accountType: string;
  editable: boolean;
  uid: null;
}

export interface CreateConnectionAPIKeyOutput {
  formula: Formula;
}

export interface Formula {
  success: Array<number | string>;
}

export function createConnection(
  params: CreateConnectionParams,
  content: CreateConnectionContent | CreateConnectionContentApiKey,
): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: '/connections',
    queryStringObject: { ...params },
    body: content,
  };
  return requestConfig;
}

export interface TestConnectionParams {
  connectionId: number;
}

export interface TestConnectionOutput {
  verified: boolean;
}

export function testConnection(params: TestConnectionParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: `/connections/${params.connectionId}/test`,
  };
  return requestConfig;
}

export interface ScopedConnectionParams {
  connectionId: number;
}

export interface ScopedConnectionContent {
  scope: string[];
}

export interface ScopedConnectionOutput {
  connection: Connection;
}

export interface Connection {
  scoped: boolean;
}

export function scopedConnection(params: ScopedConnectionParams, content: ScopedConnectionContent): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: `/connections/${params.connectionId}/scoped`,
    body: content,
  };
  return requestConfig;
}

export interface SetDataConnectionParams {
  reauthorize: number;
  connectionId: number;
}

export interface SetDataConnectionContent {
  provider: string;
  imapHost: string;
  imapPort: number;
  imapSecureConnection: boolean;
  imapUsername: string;
  imapPassword: string;
  imapRejectUnauthorized: boolean;
  imapCa: string;
  imapExplicitTLS: boolean;
}

export interface SetDataConnectionOutput {
  changed: boolean;
}

export function setDataConnection(params: SetDataConnectionParams, content: SetDataConnectionContent): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'post',
    path: `/connections/${params.connectionId}/set-data`,
    queryStringObject: { ...params },
    body: content,
  };
  return requestConfig;
}

export interface UpdateConnectionParams {
  connectionId: number;
}

export interface UpdateConnectionContent {
  name: string;
}

export interface UpdateConnectionOutput {
  connection: Connection;
}

export interface Connection {
  id: number;
  name: string;
  accountName: string;
  accountLabel: null | string;
  packageName: null | string;
  expire: null;
  metadata: null | Metadata;
  teamId: number;
  theme: string;
  upgradeable: boolean;
  scopesCnt: number;
  scoped: boolean;
  accountType: string;
  editable: boolean;
  uid: null;
}

export interface Metadata {
  value: string;
  type: string;
}

export function updateConnection(params: UpdateConnectionParams, content: UpdateConnectionContent): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'patch',
    path: `/connections/${params.connectionId}`,
    body: content,
  };
  return requestConfig;
}

export interface ListConnectionParams {
  teamId: number;
  type?: string;
}

export interface ListConnectionOutput {
  connections: Connection[];
}

export interface Connection {
  id: number;
  name: string;
  accountName: string;
  accountLabel: null | string;
  packageName: null | string;
  expire: null;
  metadata: null | Metadata;
  companyId: number;
  theme: string;
  upgradeable: boolean;
  scopes: number | Scope[];
  scoped: boolean;
  accountType: string;
  editable: boolean;
  uid: null;
}

export function listConnection(params: ListConnectionParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: '/connections',
    queryStringObject: { ...params },
  };
  return requestConfig;
}

export interface GetConnectionDetailsParams {
  connectionId: number;
}

export interface GetConnectionDetailsOutput {
  connection: Connection;
}

export interface Connection {
  id: number;
  name: string;
  accountName: string;
  accountLabel: null | string;
  packageName: null | string;
  expire: null;
  metadata: null | Metadata;
  teamId: number;
  theme: string;
  upgradeable: boolean;
  scopesCnt: number;
  scoped: boolean;
  accountType: string;
  editable: boolean;
  uid: null;
  scopes: number | Scope[];
}

export interface Metadata {
  value: string;
  type: string;
}

export interface Scope {
  id: string;
  name?: string;
  account: string;
}

export function getConnectionDetails(params: GetConnectionDetailsParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: `/connections/${params.connectionId}`,
  };
  return requestConfig;
}

export interface DeleteConnectionParams {
  connectionId: number;
  confirmed: boolean;
}

export interface DeleteConnectionOutput {
  connection: number;
}

export function deleteConnection(params: DeleteConnectionParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'delete',
    path: `/connections/${params.connectionId}`,
    queryStringObject: { ...params },
  };
  return requestConfig;
}
