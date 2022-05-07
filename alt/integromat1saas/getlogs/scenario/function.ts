/* eslint-disable @typescript-eslint/indent */
import * as Imports from '../../../../_SRC/generalFunctionImports';
// eslint-disable-next-line @typescript-eslint/naming-convention
const Integromat = require('../../../../_SRC/integromatApi/integromat.js');
// eslint-disable-next-line @typescript-eslint/naming-convention
const Blueprint = require('../../../../_SRC/integromatApi/blueprint.js');
const { v4: uuidv4 } = require('uuid');
// import axios, { AxiosRequestConfig } from 'axios';

const func = async (req: Imports.CustomHttpRequest) => {
  if (!('apiKey' in req.body && 'host' in req.body && 'teamId' in req.body && 'scenarioId' in req.body)) {
    throw new Imports.ValidationError('Please specify apiKey, host, teamId and scenarioId');
  }
  let result = {} as any;

  const { apiKey, host, teamId, scenarioId } = req.body;
  const integromat = new Integromat(apiKey, `https://${host}/api/v2`, teamId);
  await integromat.load();

  
  result = await integromat.scenarios.forScenarioId.logs.get({teamId,scenarioId}) //"pg[limit]":55}
  //.then((response:any)=> response.scenarioLogs)

  return { result };
};

export { func };
