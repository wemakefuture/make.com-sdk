import * as Imports from '../../../../_SRC/generalFunctionImports';
import { func as exportTeam } from '../team/function';
// eslint-disable-next-line @typescript-eslint/naming-convention
const Integromat = require('../../../../_SRC/integromatApi/integromat.js');
// eslint-disable-next-line @typescript-eslint/naming-convention
const Blueprint = require('../../../../_SRC/integromatApi/blueprint.js');
import axios, { AxiosRequestConfig } from 'axios';

interface Export {
  teams: any;
  apps: any;
  modules: any;
  team: any;
  organization: any;
}

const func = async (req: Imports.CustomHttpRequest) => {
  if (!('apiKey' in req.body && 'host' in req.body && ('organizationId' in req.body || 'teamId' in req.body))) {
    throw new Imports.ValidationError('Please specify apiKey, host and organizationId or teamId');
  }
  const result = {} as Export;
  let { apiKey, host, organizationId, teamId } = req.body;
  let integromat = new Integromat(apiKey, `https://${host}/api/v2`, teamId, organizationId);
  await integromat.load();
  if (typeof organizationId === 'undefined') {
    result.team = await integromat.teams.forTeamId.get({ teamId }).then((response: any) => response.team);
    organizationId = result.team.organizationId;
    integromat = new Integromat(apiKey, `https://${host}/api/v2`, teamId, organizationId);
    await integromat.load();
  }

  // look at the organization
  result.organization = await integromat.organizations.forOrganizationId
    .get({ organizationId })
    .then((response: any) => response.organization)
    .catch((response: any) => console.log(response.response.data));

  result.apps = await integromat.organizations.forOrganizationId.apps
    .get({ organizationId })
    .then((response: any) => response.installedApps)
    .catch((response: any) => console.log(response));

  for (let i = 0; i < result.apps.length; i++) {
    let appModules = [];
    appModules = await integromat.sdk.apps.forSDK_appName.forSDK_appVersion.modules
      .get({
        SDK_appName: result.apps[i].name,
        SDK_appVersion: result.apps[i].appVersion,
      })
      .then((response: any) => response.appModules)
      .catch((response: any) => console.log(response));
    result.apps[i]['modules'] = appModules;

    // add section information to modules
    const sectionNames: string[] = ['api', 'parameters', 'expect', 'interface', 'samples']; // api seems to be misleading. The url says communication

    for (let j = 0; j < appModules.length; j++) {
      const sections = {} as any;
      for (const sectionKey of sectionNames) {
        const sectionData = await integromat.sdk.apps.forSDK_appName.forSDK_appVersion.modules.forSDK_moduleName.forSDK_moduleSection
          .get({
            SDK_appName: result.apps[i].name,
            SDK_appVersion: result.apps[i].appVersion,
            SDK_moduleName: appModules[j].name,
            SDK_moduleSection: sectionKey,
          })
          .then((response: any) => response)
          .catch((response: any) => console.log(response));
        sections[sectionKey] = sectionData;
      }
      result.apps[i]['modules'][j]['sections'] = sections;
    }
  }
  // Get all teams
  result.teams = await integromat.teams
    .get({})
    .then((response: any) => response.teams)
    .catch((response: any) => console.log(response.response.data));
  // append scenario information to each team
  const subRequestsToTeamEndpoint: any = [];
  for (let i = 0; i < result.teams.length; i++) {
    subRequestsToTeamEndpoint.push(
      axios({
        method: 'POST',
        url: new URL(req.url).origin + '/integromat/exportdata/team',
        headers: { 'Content-Type': 'application/json', auth: req.apiKey },
        data: { apiKey, teamId: result.teams[i].id, host },
      }),
    );
  }
  // making the request to get all the teams information at once
  const teamsRequestsResult: any = await Promise.all(subRequestsToTeamEndpoint)
    .then((responses) => responses.map((response) => response.data.scenarios))
    .catch(console.error);
  // inserting the values for the right scenarios
  for (let i = 0; i < result.teams.length; i++) {
    result.teams[i]['scenarios'] = teamsRequestsResult[i];
  }

  // Scan scenarios

  return { result };
};

export { func };
