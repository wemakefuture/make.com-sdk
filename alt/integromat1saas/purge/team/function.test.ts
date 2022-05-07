import { CustomHttpRequest } from '../../../../_SRC/generalFunctionImports';
import { func } from './function';
const req = {} as CustomHttpRequest; // Creating an empty object from the CustomHttpRequest interface

test('delete one completely', async () => {
  req.body = {
    teamId: 1962,
    apiKey: '1ed16854-3ae8-4590-867c-30539778345c',
    host: 'eu1.make.com',
    completePurge: true,
    // removeHooks: false,
    removeConnections: true,
    removeScenarios: true,
    removeFolders: true,
  };
  return func(req).then(({ result }) => {
    console.log(result);
    expect(Object.keys(result).length).toBeGreaterThanOrEqual(1);
  });
}, 30000);
