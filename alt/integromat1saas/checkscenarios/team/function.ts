import * as Imports from '../../../../_SRC/generalFunctionImports';
// eslint-disable-next-line @typescript-eslint/naming-convention
const Integromat = require('../../../../_SRC/integromatApi/integromat.js');
// eslint-disable-next-line @typescript-eslint/naming-convention
const Blueprint = require('../../../../_SRC/integromatApi/blueprint.js');

interface Export {
  inProperState: any;
  shouldBeOn: any;
  shouldNotBeOn: any;
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
  const scenarios = await integromat.scenarios
    .get({})
    .then((response: any) => response.scenarios)
    .catch((response: any) => console.log(JSON.stringify(response, null, 4)));
  result.shouldNotBeOn = scenarios.filter((scenario: any) => scenario.islinked && scenario.name.includes('OFF'));
  result.shouldBeOn = scenarios.filter((scenario: any) => !scenario.islinked && !scenario.name.includes('OFF'));
  result.inProperState = scenarios.filter((scenario: any) => {
    return !(scenario.islinked && scenario.name.includes('OFF')) && !(!scenario.islinked && !scenario.name.includes('OFF'));
  });
  return { result };
};

export { func };
