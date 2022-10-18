/* eslint-disable @typescript-eslint/no-empty-function */
import Make from '../lib/make';
import credentials from '../credentials';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 153178,
});

const appId = '4543f66ba928df295e7dd13651787b8e';
test('appInvite', async () => {
  await process.nextTick(() => {});
  const appInvite = await make.appInvite({ appId: appId }, { organizationIds: 153178 });
  console.log(appInvite);
  expect(appInvite['appInvite']).toBeDefined();
});
