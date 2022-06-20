import Make from '../lib/make';
import credentials from '../credentials';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 94920,
});
//  create update list delete

let hookId: number;
const formId: string = '221653079490459';
const IMTCONN: number = 339401;

test('testCreateHook', async () => {
  const test = await make.createHook({
    name: 'testing hook 1',
    teamId: '60004',
    typeName: 'jotform',
    __IMTCONN__: IMTCONN,
    formId: formId,
  });
  //  console.log(test);
  hookId = test.hook.id;
  expect(test['hook']).toBeDefined();
});

test('testListHooks', async () => {
  const test = await make.listHooks({ teamId: 60004, typeName: 'gateway-webhook', assigned: true });
  //  console.log(test);
  expect(test['hooks'].length).toBeGreaterThanOrEqual(0);
});

test('testEnableHook', async () => {
  const test = await make.enableHook({ hookId: hookId });
  expect(test['success']).toEqual(true);
});

test('testDisableHook', async () => {
  const test = await make.disableHook({ hookId: hookId });
  expect(test['success']).toEqual(true);
});

test('testGetHookDetails', async () => {
  const test = await make.getHookDetails({ hookId: hookId });
  //  console.log(test);
  expect(test['hook']).toBeDefined();
});

test('testDeleteHook', async () => {
  const test = await make.deleteHook({ hookId: hookId, confirmed: true });
  //  console.log(test);
  expect(test['hook']).toEqual(hookId);
});
