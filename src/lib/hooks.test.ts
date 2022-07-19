/* eslint-disable @typescript-eslint/no-empty-function */
import Make from '../lib/make';
import credentials from '../credentials';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 153178,
});
//  create update list delete

let hookId: number;
const formId = '221653079490459';
const IMTCONN = 365165;

test('testCreateHook', async () => {
  const test = await make.createHook(
    {},
    {
      name: 'testing hook 1',
      teamId: '95348',
      typeName: 'jotform',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __IMTCONN__: IMTCONN,
      formId: formId,
    },
  );
  hookId = test.hook.id;
  expect(test['hook']).toBeDefined();
});

test('testListHooks', async () => {
  await process.nextTick(() => {});
  const test = await make.listHooks({ teamId: 95348, typeName: 'gateway-webhook', assigned: true });
  expect(test['hooks'].length).toBeGreaterThanOrEqual(0);
});

test('testEnableHook', async () => {
  await process.nextTick(() => {});
  const test = await make.enableHook({ hookId: hookId });
  expect(test['success']).toEqual(true);
});

test('testDisableHook', async () => {
  await process.nextTick(() => {});
  const test = await make.disableHook({ hookId: hookId });
  expect(test['success']).toEqual(true);
});

test('testGetHookDetails', async () => {
  await process.nextTick(() => {});
  const test = await make.getHookDetails({ hookId: hookId });
  expect(test['hook']).toBeDefined();
});

test('testDeleteHook', async () => {
  await process.nextTick(() => {});
  const test = await make.deleteHook({ hookId: hookId, confirmed: true });
  expect(test['hook']).toEqual(hookId);
});
