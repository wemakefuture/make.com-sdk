/* eslint-disable @typescript-eslint/no-empty-function */
import Make from '../lib/make';
import credentials from '../credentials';
import axios from 'axios';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 94307,
});

const appId = '4543f66ba928df295e7dd13651787b8e';
test('appInvite', async () => {
  await process.nextTick(() => {});
  const appInvite = await make.appInvite({ appId: appId }, { organizationIds: 153178 });
  console.log(appInvite);
  expect(appInvite['appInvite']).toBeDefined();
});

test('createApp', async () => {
  await process.nextTick(() => {});
  const createApp = await make.createApp({
    name: 'jest-app',
    label: 'Test App',
    theme: '#FFF00F',
    countries: ['de', 'us'],
    language: 'en',
    audience: 'countries',
    description: 'Test App',
  });
  console.log(createApp);
  expect(createApp['app']).toBeDefined();
});

test('listApps', async () => {
  await process.nextTick(() => {});
  const listApps = await make.listApps();
  console.log(listApps);
  expect(listApps['apps']).toBeDefined();
});

test('getAppSection', async () => {
  await process.nextTick(() => {});
  const getAppSection = await make.getAppSection({ appName: 'jest-app-elgiuj', appVersion: 1, section: 'modules' });
  console.log(getAppSection);
  expect(getAppSection).toBeDefined();
});

test('updateAppSection', async () => {
  await process.nextTick(() => {});
  const updateAppSection = await make.updateAppSection(
    { appName: 'codekit-dev-86a69u', appVersion: 1, section: 'base' },
    {
      baseUrl: 'https://example.com',
    },
  );
  console.log(updateAppSection);
  expect(updateAppSection).toBeDefined();
});

test('createModule', async () => {
  await process.nextTick(() => {});
  const createModule = await make.createModule(
    { appName: 'jest-app-elgiuj', appVersion: 1 },
    {
      name: 'jestModule',
      label: 'Test Module',
      description: 'Test Module',
      typeId: 1,
      connection: 'jest-app-elgiuj2',
    },
  );
  console.log(createModule);
  expect(createModule['appModule']).toBeDefined();
});

test('createAppConnection', async () => {
  await process.nextTick(() => {});
  const createAppConnection = await make.createAppConnection(
    { appName: 'jest-app-elgiuj' },
    {
      label: 'Test Connection',
      type: 'basic',
    },
  );
  console.log(createAppConnection);
  expect(createAppConnection['appConnection']).toBeDefined();
});

test('set icon of the app', async () => {
  await process.nextTick(() => {});
  // get buffer from url
  const response = await axios.get(
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.icon-icons.com%2Ficons2%2F846%2FPNG%2F512%2FDuckDuckGo_icon-icons.com_67184.png&f=1&nofb=1&ipt=022619126e3a5acc080e7af005c2ed77889dd6480e6b92d0967a98f700656a1b&ipo=images',
    {
      responseType: 'arraybuffer',
    },
  );
  const imageBuffer = Buffer.from(response.data, 'base64');
  const setIcon = await make.setIcon({ appName: 'test-app-rb8wq1', appVersion: 1 }, imageBuffer);
  console.log(setIcon);
  expect(setIcon['changed']).toBeDefined();
});
