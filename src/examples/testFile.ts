/* eslint-disable @typescript-eslint/naming-convention */
import Make from '../lib/make';
import credentials from '../credentials';

if (typeof require !== 'undefined' && require.main === module) {
  (async () => {
    const make = new Make({
      apiKey: credentials.make,
      host: 'eu1.make.com',
      organizationId: 181,
    });

    console.log(JSON.stringify(await make.listScenarios({ organizationId: 181, 'pg[limit]': 2 }), null, 4));

    const test = await make.listScenarios({ organizationId: 181, 'pg[limit]': 2 });
    console.log('last edit', test.scenarios[0].lastEdit);

    // console.log(await make.createFolder({ teamId: 2313, name: 'Soooome folder' }));
  })();
}
