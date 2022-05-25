import Make from '../lib/make';
import credentials from '../credentials';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 94920,
});

test('testCreateHook', async () => {
  const testCreateHook = await make.createHook({
    name: 'testing hook 1 new',
    teamId: '60004',
    typeName: 'web',
    __IMTCONN__: 96,
    formId: '91282545501352',
  });
  console.log(testCreateHook);
  expect(testCreateHook['hook']).toBeDefined();
});

test('testListHooks', async () => {
  const testListHooks = await make.listHooks({ teamId: 60004, typeName: 'gateway-webhook', assigned: true, viewForScenarioId: 279836 });
  expect(testListHooks['hooks'].length).toBeGreaterThanOrEqual(0);
});

test('testDeleteHook', async () => {
  const testDeleteHook = await make.deleteHook({ hookId: 140204, confirmed: true });
  expect(testDeleteHook['hook']).toEqual(140204);
});

test('testEnableHook', async () => {
  const testEnableHook = await make.enableHook({ hookId: 137952 });
  expect(testEnableHook['success']).toEqual(true);
});

test('testDisableHook', async () => {
  const testDisableHook = await make.disableHook({ hookId: 137952 });
  expect(testDisableHook['success']).toEqual(true);
});

test('testGetHookDetails', async () => {
  const testGetHookDetails = await make.getHookDetails({ hookId: 137952 });
  expect(testGetHookDetails['hook']).toBeDefined();
});
