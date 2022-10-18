import { MakeRequestConfig } from './make';

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
