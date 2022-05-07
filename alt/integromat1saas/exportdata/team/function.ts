import * as Imports from '../../../../_SRC/generalFunctionImports';
// eslint-disable-next-line @typescript-eslint/naming-convention
const Integromat = require('../../../../_SRC/integromatApi/integromat.js');
// eslint-disable-next-line @typescript-eslint/naming-convention
const Blueprint = require('../../../../_SRC/integromatApi/blueprint.js');

interface Export {
  scenarios: any;
  team: any;
}

const func = async (req: Imports.CustomHttpRequest) => {
  if (!('apiKey' in req.body && 'host' in req.body && 'teamId' in req.body)) {
    throw new Imports.ValidationError('Please specify apiKey, host and teamId');
  }
  const result = {} as Export;

  const { apiKey, host, teamId } = req.body;
  const integromat = new Integromat(apiKey, `https://${host}/api/v2`, teamId);
  await integromat.load();

  // getting scenarios
  result.scenarios = await integromat.scenarios
    .get({})
    .then((response: any) => response.scenarios)
    .catch((response: any) => console.log(JSON.stringify(response, null, 4)));

  // Getting blueprints for each scenario
  for (let i = 0; i < result.scenarios.length; i++) {
    const blueprint = await integromat.scenarios.forScenarioId.blueprint
      .get({ teamId, scenarioId: result.scenarios[i].id })
      .then((response: any) => response.response)
      .catch((response: any) => console.log(JSON.stringify(response, null, 4)));
    result.scenarios[i]['blueprint'] = blueprint;
  }

  return { result };
};

export { func };
