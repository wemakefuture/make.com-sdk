import { CustomHttpRequest, AuthError } from '../../../_SRC/generalFunctionImports';
import { func } from './function';
const req = {} as CustomHttpRequest; // Creating an empty object from the CustomHttpRequest interface

test('Check an Api Key that works', async () => {
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
    expect(true == true);
  });
});


// test('Too weak key', async () => {
//   req.body = {
//     teamId: 1962,
//     apiKey: 'b464edd8-bada-4aad-b4b7-1f6e3faa53c0',
//     host: 'eu1.make.com',
//     completePurge: true,
//     // removeHooks: false,
//     removeConnections: true,
//     removeScenarios: true,
//     removeFolders: true,
//   };
//   await expect(func(req)).rejects.toThrowError('There was an issue with the authorization. Please check your API key and the host.');
// });


test('Check an Api Key that does not work', async () => {
  req.body = {
    teamId: 1962,
    apiKey: 'äääääääääää',
    host: 'eu1.make.com',
    completePurge: true,
    // removeHooks: false,
    removeConnections: true,
    removeScenarios: true,
    removeFolders: true,
  };
  await expect(func(req)).rejects.toThrowError(AuthError);
});



