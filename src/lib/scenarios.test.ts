import Make from '../lib/make';
import credentials from '../credentials';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 153178,
});
//  create update list delete

let scenarioId: number;
let cloneScenarioId: number;
const folderId = 29327;
const scenarioLogId = 351453;

test('testCreateScenario', async () => {
  const test = await make.createScenario({
    blueprint:
      '{"name":"Integration Weather New","flow":[{"id":1,"module":"weather:ActionGetCurrentWeather","version":1,"parameters":{},"mapper":{"type":"name","city":"berlin"},"metadata":{"designer":{"x":0,"y":0},"restore":{"expect":{"type":{"label":"cities"}}},"expect":[{"name":"type","type":"select","label":"I want to enter a location by","required":true,"validate":{"enum":["name","coords"]}},{"name":"city","type":"text","label":"City","required":true}]}}],"metadata":{"instant":false,"version":1,"scenario":{"roundtrips":1,"maxErrors":3,"autoCommit":true,"autoCommitTriggerLast":true,"sequential":false,"confidential":false,"dataloss":false,"dlq":false},"designer":{"orphans":[]},"zone":"eu1.make.com"}}',
    teamId: 95348,
    folderId: folderId,
    concept: false,
    basedon: 20,
    scheduling: '{"type":"indefinitely","interval":900}',
  });
  //  console.log(test);
  scenarioId = test.scenario.id;
  expect(test).toBeDefined();
});

test('testUpdateScenario', async () => {
  const test = await make.updateScenario(
    { scenarioId: scenarioId },
    {
      folderId: folderId,
      blueprint:
        '{"name":"Integration Weather Updated","flow":[{"id":1,"module":"weather:ActionGetCurrentWeather","version":1,"parameters":{},"mapper":{"type":"name","city":"berlin"},"metadata":{"designer":{"x":0,"y":0},"restore":{"expect":{"type":{"label":"cities"}}},"expect":[{"name":"type","type":"select","label":"I want to enter a location by","required":true,"validate":{"enum":["name","coords"]}},{"name":"city","type":"text","label":"City","required":true}]}}],"metadata":{"instant":false,"version":1,"scenario":{"roundtrips":1,"maxErrors":3,"autoCommit":true,"autoCommitTriggerLast":true,"sequential":false,"confidential":false,"dataloss":false,"dlq":false},"designer":{"orphans":[]},"zone":"eu1.make.com"}}',
      name: 'Integration Web Updated',
      scheduling: '{"type":"indefinitely","interval":900}',
      concept: false,
    },
  );
  //  console.log(test);
  expect(test).toBeDefined();
});

test('testListScenario', async () => {
  //  console.log(JSON.stringify(await make.listScenarios({ organizationId: 94920, 'pg[limit]': 2 }), null, 4));
  const test = await make.listScenarios({ organizationId: 153178, 'pg[limit]': 2 });
  //  console.log('last edit', test.scenarios[0].lastEdit);
  expect(test['scenarios'].length).toBeGreaterThanOrEqual(0);
});

test('testListScenarioBlueprints', async () => {
  const test = await make.listScenarioBlueprints({ scenarioId: scenarioId, 'pg[limit]': 2 });
  expect(test['scenariosBlueprints'].length).toBeGreaterThanOrEqual(0);
});

test('testGetScenarioDetails', async () => {
  const test = await make.getScenarioDetails({ scenarioId: scenarioId });
  //  console.log(test);
  expect(test['scenario']).toBeDefined();
});

test('testGetScenarioTrigger', async () => {
  const test = await make.getScenarioTrigger({ scenarioId: scenarioId });
  expect(test).toBeDefined();
});

test('testStartScenario', async () => {
  const test = await make.startScenario({ scenarioId: scenarioId });
  expect(test['scenario']).toBeDefined();
});

test('testListScenarioLogs', async () => {
  const test = await make.listScenarioLogs({ scenarioId: scenarioLogId });
  expect(test['scenarioLogs'].length).toBeGreaterThanOrEqual(0);
});

test('testGetScenarioExecutionLog', async () => {
  //  getting the executionId for the scenario
  let id = '';
  const temp = await make.listScenarioLogs({ scenarioId: scenarioLogId });
  for (let i = 0; i < temp.scenarioLogs.length; i++) {
    if (temp.scenarioLogs[i]['type'] == 'auto' || temp.scenarioLogs[i]['type'] == 'manual') {
      id = temp.scenarioLogs[i]['id'].toString();
    }
  }
  const test = await make.getScenarioExecutionLog({ scenarioId: scenarioLogId, executionId: id });
  expect(test['scenarioLog']).toBeDefined();
});

test('testGetScenarioBlueprint', async () => {
  const test = await make.getScenarioBlueprint({ scenarioId: scenarioId });
  expect(test).toBeDefined();
});

test('testStopScenario', async () => {
  const test = await make.stopScenario({ scenarioId: scenarioId });
  expect(test['scenario']).toBeDefined();
});

test('testCloneScenario', async () => {
  const test = await make.cloneScenario(
    { organizationId: 153178, scenarioId: scenarioId },
    {
      name: 'Integration Webhooks Copy 2',
      teamId: 95348,
      states: false,
    },
  );
  cloneScenarioId = test.scenario['id'];
  expect(test).toBeDefined();
});

test('testDeleteScenario', async () => {
  const test = await make.deleteScenario({ scenarioId: scenarioId });
  //  console.log(test);
  expect(test['scenario']).toEqual(scenarioId);
});

// delete the scenario we cloned
test('testDeleteClonedScenario', async () => {
  const test = await make.deleteScenario({ scenarioId: cloneScenarioId });
  //  console.log(test);
  expect(test['scenario']).toEqual(cloneScenarioId);
});
