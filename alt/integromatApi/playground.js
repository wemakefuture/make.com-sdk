// eslint-disable-next-line @typescript-eslint/naming-convention
const Integromat = require('./integromat');
// eslint-disable-next-line @typescript-eslint/naming-convention
const Blueprint = require('./blueprint');

// For reference: https://github.com/wemakefuture/integromat-wraper-openapi

const apiKey = 'feaa1be7-0d24-4ae7-8d0e-bd4b8a9fe60c'
const teamId = undefined //2313
const organizationId = 181

const integromat = new Integromat(apiKey, "https://eu1.make.com/api/v2", teamId, organizationId)

if (typeof require !== 'undefined' && require.main === module) {
    (async () => {
        await integromat.load()
        await integromat.scenarios.get({ "pg[limit]": 10000 })
            .then(console.log)
            .catch((response) => console.log(response.response.data))
    })()
}

