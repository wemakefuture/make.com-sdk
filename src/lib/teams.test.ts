/* eslint-disable @typescript-eslint/no-empty-function */
import Make from '../lib/make';
import credentials from '../credentials';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 94307,
});

const organizationId = 94307;

test('testListTeams', async () => {
  await process.nextTick(() => {});
  const test = await make.listTeams({ organizationId: organizationId });
  expect(test.teams).toBeDefined();
});
