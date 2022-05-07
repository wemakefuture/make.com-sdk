import { debug } from 'console';
import * as Imports from '../../../../_SRC/generalFunctionImports';
import { func as checkScenariosTeam } from '../team/function';
// eslint-disable-next-line @typescript-eslint/naming-convention
const Integromat = require('../../../../_SRC/integromatApi/integromat.js');
// eslint-disable-next-line @typescript-eslint/naming-convention
const Blueprint = require('../../../../_SRC/integromatApi/blueprint.js');

interface Export {
  byTeam: any;
  all: any;
}

const func = async (req: Imports.CustomHttpRequest) => {
  if (!('apiKey' in req.body && 'host' in req.body && 'organizationId' in req.body)) {
    throw new Imports.ValidationError('Please specify apiKey, host and teamId');
  }
  const result = {} as Export;

  const { apiKey, host, organizationId } = req.body;
  const integromat = new Integromat(apiKey, `https://${host}/api/v2`, undefined, organizationId);
  await integromat.load();

  // Get all teams
  result.byTeam = await integromat.teams
    .get({})
    .then((response: any) => response.teams)
    .catch((response: any) => console.log(response.response.data));

  // Check scenarios for each team
  result.all = {};
  result.all.inProperState = [];
  result.all.shouldBeOn = [];
  result.all.shouldNotBeOn = [];
  for (let i = 0; i < result.byTeam.length; i++) {
    const teamReq = {} as Imports.CustomHttpRequest; // Creating an empty object from the CustomHttpRequest interface
    teamReq.body = { apiKey, teamId: result.byTeam[i].id, host };
    const checkScenarioResult = await checkScenariosTeam(teamReq)
      .then((response: any) => response.result)
      .catch((response: any) => console.log(response));
    result.byTeam[i] = { ...result.byTeam[i], ...checkScenarioResult };

    result.all.inProperState = [...result.all.inProperState, ...checkScenarioResult.inProperState];
    result.all.shouldBeOn = [...result.all.shouldBeOn, ...checkScenarioResult.shouldBeOn];
    result.all.shouldNotBeOn = [...result.all.shouldNotBeOn, ...checkScenarioResult.shouldNotBeOn];
  }

  // some change

  // eslint-disable-next-line no-debugger
  // debugger;
  return { result };
};

export { func };
