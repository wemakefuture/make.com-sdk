import Make from '../lib/make';
import credentials from '../credentials';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 181,
});

test('testCreateFolder', async () => {
  const testCreateFolder = await make.createFolder({ name: 'Folder 3', teamId: 60004 });
  //  console.log(testCreateFolder);
  expect(testCreateFolder['scenarioFolder']).toBeDefined();
});

test('testDeleteFolder', async () => {
  const testDeleteFolder = await make.deleteFolder({ folderId: 24696 });
  expect(testDeleteFolder['scenarioFolder']).toEqual(24696);
});

test('testUpdateFolder', async () => {
  const testUpdateFolder = await make.updateFolder({ scenarioFolderId: 24624, name: 'Temp 1' });
  expect(testUpdateFolder['scenarioFolder'].name).toEqual('Temp 1');
});

test('testListFolders', async () => {
  const testListFolders = await make.listFolders({ teamId: 60004 });
  expect(testListFolders['scenariosFolders'].length).toBeGreaterThanOrEqual(0);
});
