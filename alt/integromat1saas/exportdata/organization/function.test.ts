import { CustomHttpRequest } from '../../../../_SRC/generalFunctionImports';
import { func } from './function';
import keys from '../../../../_SRC/credentialConfig';
const req = {} as CustomHttpRequest; // Creating an empty object from the CustomHttpRequest interface

test('Export data from an organization', async () => {
  req.body = {
    // organizationId: 181,
    teamId: 2313,
    apiKey: keys.integromat,
    host: 'eu1.make.com',
  };
  return func(req).then(({ result }) => {
    expect(result).toHaveProperty('apps');
  });
}, 30000);
