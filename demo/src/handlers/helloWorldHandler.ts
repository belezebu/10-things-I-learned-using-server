import { APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import captureCorrelationIds from '@dazn/lambda-powertools-middleware-correlation-ids';
import Logger from '@dazn/lambda-powertools-logger';
import { createAPIResponse } from '../utils/utils';

const helloWorldHandler = async (): Promise<APIGatewayProxyResult> => {
  Logger.info('Returning Hello World Response');
  return createAPIResponse(200, { message: 'Hello World' });
};

export default middy(helloWorldHandler)
    .use(captureCorrelationIds({ sampleDebugLogRate: 1.0 }))
    .use(httpErrorHandler())
