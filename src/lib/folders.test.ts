/* eslint-disable @typescript-eslint/no-empty-function */
import Make from '../lib/make';
import credentials from '../credentials';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 153178,
});

let folderId: number;

test('testCreateFolder', async () => {
  await process.nextTick(() => {});
  const testCreateFolder = await make.createFolder({ name: 'Folder 3', teamId: 95348 });
  folderId = testCreateFolder.scenarioFolder.id;
  expect(testCreateFolder['scenarioFolder']).toBeDefined();
});

test('testUpdateFolder', async () => {
  await process.nextTick(() => {});
  const testUpdateFolder = await make.updateFolder({ scenarioFolderId: folderId }, { name: 'Temp 1' });
  expect(testUpdateFolder['scenarioFolder'].name).toEqual('Temp 1');
});

test('testListFolders', async () => {
  await process.nextTick(() => {});
  const testListFolders = await make.listFolders({ teamId: 95348 });
  expect(testListFolders['scenariosFolders'].length).toBeGreaterThanOrEqual(0);
});

test('testDeleteFolder', async () => {
  await process.nextTick(() => {});
  const testDeleteFolder = await make.deleteFolder({ folderId: folderId });
  expect(testDeleteFolder['scenarioFolder']).toEqual(folderId);
});
