import Make from '../lib/make';
import credentials from '../credentials';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 94920,
});
//  create update list delete

let scenarioId: number;
const folderId: number = 27775;
let executionId: string = '';

test('testCreateScenario', async () => {
  const test = await make.createScenario({
    blueprint:
      '{"name":"New Testing scenario","flow":[{"id":null,"module":"placeholder:Placeholder","metadata":{"designer":{"x":0,"y":0}}}],"metadata":{"instant":false,"version":1,"scenario":{"roundtrips":1,"maxErrors":3,"autoCommit":true,"autoCommitTriggerLast":true,"sequential":false,"confidential":false,"dataloss":false,"dlq":false},"designer":{"orphans":[]},"zone":"eu1.make.com"}}',
    teamId: 60004,
    folderId: folderId,
    concept: false,
    basedon: 20,
    scheduling: '{"type":"indefinitely","interval":900}',
  });
  console.log(test);
  scenarioId = test.scenario.id;
  expect(test).toBeDefined();
});

test('testUpdateScenario', async () => {
  const obj = JSON.stringify({
    name: 'Integration Web Updated',
    flow: [{ id: null, module: 'placeholder:Placeholder', metadata: { designer: { x: 0, y: 0 } } }],
    metadata: {
      instant: false,
      version: 1,
      scenario: {
        roundtrips: 1,
        maxErrors: 3,
        autoCommit: true,
        autoCommitTriggerLast: true,
        sequential: false,
        confidential: false,
        dataloss: false,
        dlq: false,
      },
      designer: { orphans: [] },
      zone: 'eu1.make.com',
    },
  });
  const test = await make.updateScenario({
    scenarioId: 329445,
    folderId: 27775,
    blueprint: `${obj}`,
    name: 'Integration Web Updated',
    scheduling: '{"type":"indefinitely","interval":900}',
    concept: false,
  });
  console.log(test);
  expect(test).toBeDefined();
});

test('testListScenario', async () => {
  //  console.log(JSON.stringify(await make.listScenarios({ organizationId: 94920, 'pg[limit]': 2 }), null, 4));
  const test = await make.listScenarios({ organizationId: 94920, 'pg[limit]': 2 });
  //  console.log('last edit', test.scenarios[0].lastEdit);
  expect(test['scenarios'].length).toBeGreaterThanOrEqual(0);
});

test('testListScenarioBlueprints', async () => {
  const test = await make.listScenarioBlueprints({ scenarioId: scenarioId, 'pg[limit]': 2 });
  expect(test['scenariosBlueprints'].length).toBeGreaterThanOrEqual(0);
});

test('testGetScenarioDetails', async () => {
  const test = await make.getScenarioDetails({ scenarioId: scenarioId });
  console.log(test);
  expect(test['scenario']).toBeDefined();
});

test('testGetScenarioTrigger', async () => {
  const test = await make.getScenarioTrigger({ scenarioId: scenarioId });
  expect(test).toBeDefined();
});

test('testListScenarioLogs', async () => {
  const test = await make.listScenarioLogs({ scenarioId: scenarioId });
  //  console.log(test);
  for (let i = 0; i < test.scenarioLogs.length; i++) {
    if (test.scenarioLogs[i]['status']) {
      executionId = test.scenarioLogs[i]['id'].toString();
      break;
    }
  }
  //  console.log(executionId);
  expect(test['scenarioLogs'].length).toBeGreaterThanOrEqual(0);
});

test('testGetScenarioExecutionLog', async () => {
  const test = await make.getScenarioExecutionLog({ scenarioId: scenarioId, executionId: executionId });
  //  console.log(test);
  expect(test['scenarioLog']).toBeDefined();
});

test('testGetScenarioBlueprint', async () => {
  const test = await make.getScenarioBlueprint({ scenarioId: scenarioId });
  expect(test).toBeDefined();
});

test('testStartScenario', async () => {
  const test = await make.startScenario({ scenarioId: scenarioId });
  console.log(test);
  expect(test['scenario']).toBeDefined();
});

test('testStopScenario', async () => {
  const test = await make.stopScenario({ scenarioId: scenarioId });
  console.log(test);
  expect(test['scenario']).toBeDefined();
});

test('testCloneScenario', async () => {
  const test = await make.cloneScenario({
    name: 'Integration Webhooks Copy 2',
    teamId: 60004,
    states: false,
    organizationId: 94920,
    scenarioId: 330110,
  });
  console.log(test);
  expect(test).toBeDefined();
});
