import Make from '../lib/make';
import credentials from '../credentials';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 94920,
});

let folderId: number;

test('testCreateFolder', async () => {
  const testCreateFolder = await make.createFolder({ name: 'Folder 3', teamId: 60004 });
  folderId = testCreateFolder.scenarioFolder.id;
  //  console.log(testCreateFolder);
  expect(testCreateFolder['scenarioFolder']).toBeDefined();
});

test('testUpdateFolder', async () => {
  const testUpdateFolder = await make.updateFolder({ scenarioFolderId: folderId, name: 'Temp 1' });
  expect(testUpdateFolder['scenarioFolder'].name).toEqual('Temp 1');
});

test('testListFolders', async () => {
  const testListFolders = await make.listFolders({ teamId: 60004 });
  expect(testListFolders['scenariosFolders'].length).toBeGreaterThanOrEqual(0);
});

test('testDeleteFolder', async () => {
  const testDeleteFolder = await make.deleteFolder({ folderId: folderId });
  expect(testDeleteFolder['scenarioFolder']).toEqual(folderId);
});
