import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { init, lambdaWrapper } from 'epsagon';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import captureCorrelationIds from '@dazn/lambda-powertools-middleware-correlation-ids';
import Logger from '@dazn/lambda-powertools-logger';
import flow from 'lodash.flow';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 } from 'uuid';
import createError from 'http-errors';
import { createAPIResponse } from '../utils/utils';

init({
  token: process.env.EPSAGON_TOKEN,
  appName: process.env.APP_NAME,
  metadataOnly: false
});

const documentClient = new DocumentClient({
  apiVersion: '2012-08-10',
  convertEmptyValues: true
});

type Dummy = {
  name: string;
  description: string;
};

const saveDummyHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  Logger.info('Creating a new Dummy object');
  const dummy: Dummy = event.body as any;
  const dummyId = v4();
  const params = {
    TableName: process.env.DUMMY_TABLE,
    Item: {
      dummyId,
      ...dummy
    }
  };
  Logger.info('Params', { params });
  try {
    await documentClient.put(params).promise();
    return createAPIResponse(201, { dummyId });
  } catch (e) {
    const errorMessage = 'Error creating a Dummy object';
    Logger.error(errorMessage, e);
    throw new createError.InternalServerError(errorMessage);
  }
};

export default flow([lambdaWrapper])(
  middy(saveDummyHandler)
    .use(captureCorrelationIds({ sampleDebugLogRate: 1.0 }))
    .use(jsonBodyParser())
    .use(httpErrorHandler())
);
