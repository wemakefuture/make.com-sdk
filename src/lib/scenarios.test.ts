import Make from '../lib/make';
import credentials from '../credentials';

const make = new Make({
  apiKey: credentials.make,
  host: 'eu1.make.com',
  organizationId: 181,
});

test('testListScenario', async () => {
  console.log(JSON.stringify(await make.listScenarios({ organizationId: 94920, 'pg[limit]': 2 }), null, 4));
  const test = await make.listScenarios({ organizationId: 94920, 'pg[limit]': 2 });
  console.log('last edit', test.scenarios[0].lastEdit);
  expect(test['scenarios'].length).toBeGreaterThanOrEqual(0);
});

test('testGetScenarioDetails', async () => {
  const test = await make.getScenarioDetails({ scenarioId: 279836 });
  expect(test['scenario']).toBeDefined();
});

test('testGetScenarioTrigger', async () => {
  const test = await make.getScenarioTrigger({ scenarioId: 279836 });
  expect(test).toBeDefined();
});

test('testListScenarioBlueprints', async () => {
  const test = await make.listScenarioBlueprints({ scenarioId: 279836, 'pg[limit]': 2 });
  expect(test['scenariosBlueprints'].length).toBeGreaterThanOrEqual(0);
});

test('testListScenarioLogs', async () => {
  const test = await make.listScenarioLogs({ scenarioId: 279836 });
  console.log(test);
  expect(test['scenarioLogs'].length).toBeGreaterThanOrEqual(0);
});

test('testGetScenarioExecutionLog', async () => {
  const test = await make.getScenarioExecutionLog({ scenarioId: 235663, executionId: '915b5ae4c8de4ef2bcc425c9463e3499' });
  expect(test['scenarioLog']).toBeDefined();
});

test('testUpdateScenario', async () => {
  const test = await make.updateScenario({
    scenarioId: 279836,
    folderId: 24624,
    blueprint:
      '{"name":"Integration Webhooks","flow":[{"id":1,"module":"gateway:CustomWebHook","version":1,"parameters":{"hook":137952,"maxResults":1},"mapper":{},"metadata":{"designer":{"x":0,"y":0},"restore":{"parameters":{"hook":{"data":{"editable":"true"},"label":"My gateway-webhook webhook"}}},"parameters":[{"name":"hook","type":"hook:gateway-webhook","label":"Webhook","required":true},{"name":"maxResults","type":"number","label":"Maximum number of results"}],"interface":[{"name":"hook id","type":"number"}]}}],"metadata":{"instant":true,"version":1,"scenario":{"roundtrips":1,"maxErrors":3,"autoCommit":true,"autoCommitTriggerLast":true,"sequential":false,"confidential":false,"dataloss":false,"dlq":false},"designer":{"orphans":[]},"zone":"eu1.make.com"}}',
    name: 'Integration Webhooks',
    scheduling: '{"type":"indefinitely","interval":900}',
    concept: false,
  });
  console.log(test);
  expect(test).toBeDefined();
});

test('testCreateScenario', async () => {
  const test = await make.createScenario({
    blueprint:
      '{"name":"Integration Webhooks New","flow":[{"id":1,"module":"gateway:CustomWebHook","version":1,"parameters":{"hook":137952,"maxResults":1},"mapper":{},"metadata":{"designer":{"x":0,"y":0},"restore":{"parameters":{"hook":{"data":{"editable":"true"},"label":"My gateway-webhook webhook"}}},"parameters":[{"name":"hook","type":"hook:gateway-webhook","label":"Webhook","required":true},{"name":"maxResults","type":"number","label":"Maximum number of results"}],"interface":[{"name":"hook id","type":"number"}]}}],"metadata":{"instant":true,"version":1,"scenario":{"roundtrips":1,"maxErrors":3,"autoCommit":true,"autoCommitTriggerLast":true,"sequential":false,"confidential":false,"dataloss":false,"dlq":false},"designer":{"orphans":[]},"zone":"eu1.make.com"}}',
    teamId: 60004,
    folderId: 24624,
    concept: false,
    basedon: 1,
    scheduling: '{"type":"indefinitely","interval":900}',
  });
  console.log(test);
  expect(test).toBeDefined();
});

test('testStartScenario', async () => {
  const test = await make.startScenario({ scenarioId: 279836 });
  console.log(test);
  expect(test['scenario']).toBeDefined();
});

test('testStopScenario', async () => {
  const test = await make.stopScenario({ scenarioId: 279836 });
  console.log(test);
  expect(test['scenario']).toBeDefined();
});

test('testCloneScenario', async () => {
  const test = await make.cloneScenario({
    organizationId: 94920,
    scenarioId: 279836,
    notAnalyze: false,
    name: 'Integration Webhooks Copy',
    teamId: 60004,
    states: false,
    account: { '109': '' },
  });
  console.log(test);
  expect(test).toBeDefined();
});

test('testGetScenarioBlueprint', async () => {
  const test = await make.getScenarioBlueprint({ scenarioId: 279836 });
  expect(test).toBeDefined();
});
