import { CustomHttpRequest } from '../../../_SRC/generalFunctionImports';
import { func } from './function';
const req = {} as CustomHttpRequest; // Creating an empty object from the CustomHttpRequest interface

test('Add error handlers to all scenarios', async () => {
  req.body = {
    teamId: 2313,
    apiKey: '1ed16854-3ae8-4590-867c-30539778345c',
    host: 'eu1.make.com',
    developer: 'Werner@wemakefuture.com',
    errorCode: 400,
    level: 1,
    connection: {
      webhook: 'http://www.google.com',
      clientName: 'client name',
      accountEmail: 'email@gmail.com',
      accountNumber: 123,
      preferExisting: true,
    },
  };
  return func(req).then(({ result }) => {
    expect(result).toHaveProperty('result');
  });
}, 30000);

test('Add errorhandlers to specific scenario', async () => {
  req.body = {
    teamId: 2313,
    apiKey: '1ed16854-3ae8-4590-867c-30539778345c',
    scenarios: 3744,
    host: 'eu1.make.com',
    developer: 'werner2@wemakefuture.com',
    errorCode: 400,
    level: 1,
    connection: {
      webhook: 'http://www.google.com',
      clientName: 'client name',
      accountEmail: 'email@gmail.com',
      accountNumber: 123,
      preferExisting: true,
    },
  };
  return func(req).then(({ result }) => {
    expect(result).toHaveProperty('result');
  });
}, 30000);
