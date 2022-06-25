/* eslint-disable @typescript-eslint/naming-convention */
import Make from '../lib/make';
import credentials from '../credentials';

if (typeof require !== 'undefined' && require.main === module) {
  (async () => {
    const make = new Make({
      apiKey: 'feaa1be7-0d24-4ae7-8d0e-bd4b8a9fe60c',
      host: 'eu1.make.com',
      organizationId: 2313,
    });

    console.log(
      JSON.stringify(await make.getScenarioExecutionLog({ scenarioId: 347218, executionId: '0b0cbd34408a4ee39e30bd8ea95b7142' }), null, 4),
    );

    // console.log(await make.createFolder({ teamId: 2313, name: 'Soooome folder' }));

    //  const testGetScenarioDetails = await make.getScenarioDetails({})
  })();
}
