import Make from '../lib/make';
import credentials from '../credentials';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 153178,
});

const organizationId = 153178;

test('testListTeams', async () => {
  const test = await make.listTeams({ organizationId: organizationId });
  expect(test.teams).toBeDefined();
});
