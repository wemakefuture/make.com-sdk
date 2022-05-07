/* eslint-disable @typescript-eslint/indent */
import * as Imports from '../../../_SRC/generalFunctionImports';
// eslint-disable-next-line @typescript-eslint/naming-convention
const Integromat = require('../../../_SRC/integromatApi/integromat.js');
// eslint-disable-next-line @typescript-eslint/naming-convention
const Blueprint = require('../../../_SRC/integromatApi/blueprint.js');
const { v4: uuidv4 } = require('uuid');
// import axios, { AxiosRequestConfig } from 'axios';

const func = async (req: Imports.CustomHttpRequest) => {
  if (!('apiKey' in req.body && 'host' in req.body && ('teamId' in req.body || 'organizationId' in req.body))) {
    throw new Imports.ValidationError('Please specify apiKey, host, teamId or organizationId');
  }
  const result = {} as any;

  const { apiKey, host, teamId, organizationId } = req.body;
  const integromat = new Integromat(apiKey, `https://${host}/api/v2`);
  await integromat.load();

  const permissions = await integromat.enums.userApiTokenScopes.get({ teamId })
    .then((response: any) => response.userApiTokenScopes.map((element: any) => element.name))
    .catch((error: Error) => { throw new Imports.AuthError(`There was an issue with the authorization. Please check your API key, the host and the necessary permission which are:\n ${requiredPermissions.join(", ")}`) })
  for (const requiredPermission of requiredPermissions) {
    if (!permissions.includes(requiredPermission)) {
      throw new Imports.AuthError(`The provided API key lacks at least the permission "${requiredPermission}" to be accepted.`, 401)
    }
  }

  return { result };
};

export { func };

const requiredPermissions =
  [
    'admin:read',
    'admin:write',
    'apps:read',
    'apps:write',
    'connections:read',
    'connections:write',
    'datastores:read',
    'datastores:write',
    'devices:read',
    'devices:write',
    'dlqs:read',
    'dlqs:write',
    'hooks:read',
    'hooks:write',
    'imt-forms:read',
    'keys:read',
    'keys:write',
    'notifications:read',
    'notifications:write',
    'organizations:read',
    'organizations:write',
    'scenarios:read',
    'scenarios:write',
    'sdk-apps:read',
    'sdk-apps:write',
    'system:read',
    'system:write',
    'teams:read',
    'teams:write',
    'templates:read',
    'templates:write',
    'udts:read',
    'udts:write',
    'user:read',
    'user:write'
  ]