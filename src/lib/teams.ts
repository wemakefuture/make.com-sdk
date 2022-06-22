import { BaseMakeRequestParams, MakeRequestConfig } from './make';

export interface ListTeamsParams extends BaseMakeRequestParams {
  organizationId: number;
}

export interface ListTeamsOutput {
  teams: Team[];
  pg: PG;
}

export interface PG {
  sortBy: string;
  sortDir: string;
  limit: number;
  offset: number;
}

export interface Team {
  id: number;
  name: string;
  organizationId: number;
}

export function listTeams(params: ListTeamsParams): MakeRequestConfig {
  const requestConfig: MakeRequestConfig = {
    method: 'get',
    path: '/teams',
    queryStringObject: { ...params },
  };
  return requestConfig;
}
