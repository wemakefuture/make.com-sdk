import { CustomHttpRequest } from '../../../../_SRC/generalFunctionImports';
import { func } from './function';
import keys from '../../../../_SRC/credentialConfig';
const req = {} as CustomHttpRequest; // Creating an empty object from the CustomHttpRequest interface

test('Check scenarios in a team in the test environment', async () => {
  req.body = {
    teamId: 2313,
    apiKey: keys.integromat,
    host: 'eu1.make.com',
  };
  return func(req).then(({ result }) => {
    expect(result).toHaveProperty('scenarios');
  });
}, 30000);
