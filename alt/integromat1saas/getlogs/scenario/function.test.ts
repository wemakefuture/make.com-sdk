import { CustomHttpRequest } from '../../../../_SRC/generalFunctionImports';
import { func } from './function';
const req = {} as CustomHttpRequest; // Creating an empty object from the CustomHttpRequest interface

test('delete one completely', async () => {
  req.body = {
    teamId: 2313,
    apiKey: '1ed16854-3ae8-4590-867c-30539778345c',
    host: 'eu1.make.com',
    scenarioId: "3743"
  };
  return func(req).then(({ result }) => {
    console.log(result);
    expect(Object.keys(result).length).toBeGreaterThanOrEqual(1);
  });
}, 30000);
