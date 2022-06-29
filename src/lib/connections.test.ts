/* eslint-disable @typescript-eslint/no-empty-function */
import Make from '../lib/make';
import credentials from '../credentials';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 153178,
});

const teamId = 95348;
//  jotform api key
const apiKey = 'abf6916b154ad3e305a984e7e5fe3003';
let connectionId: number;

test('testCreateConnection', async () => {
  await process.nextTick(() => {});
  const test = await make.createConnection(
    { teamId: teamId, inspector: 1 },
    { accountName: 'jotform', accountType: 'jotform', apiKey: apiKey },
  );
  connectionId = test.formula.success[0];
  expect(test).toBeDefined();
});

test('testTestConnection', async () => {
  await process.nextTick(() => {});
  const test = await make.testConnection({ connectionId: connectionId });
  expect(test.verified).toBeDefined();
});

test('testScopedConnection', async () => {
  await process.nextTick(() => {});
  const test = await make.scopedConnection({ connectionId: connectionId }, { scope: [] });
  expect(test.connection).toBeDefined();
});

// test('setDataConnection', async () => {
//   const test = await make.setDataConnection({ connectionId: connectionId, reauthorize: 1 }, {});
// });

test('testUpdateConnection', async () => {
  await process.nextTick(() => {});
  const test = await make.updateConnection({ connectionId: connectionId }, { name: 'Test Connection' });
  expect(test.connection).toBeDefined();
});

test('testListConnection', async () => {
  await process.nextTick(() => {});
  const test = await make.listConnection({ teamId: teamId });
  expect(test.connections).toBeDefined();
});

test('testGetConnectionDetails', async () => {
  await process.nextTick(() => {});
  const test = await make.getConnectionDetails({ connectionId: connectionId });
  expect(test.connection).toBeDefined();
});

test('testDeleteConnection', async () => {
  await process.nextTick(() => {});
  const test = await make.deleteConnection({ connectionId: connectionId, confirmed: true });
  expect(test.connection).toEqual(connectionId);
});
