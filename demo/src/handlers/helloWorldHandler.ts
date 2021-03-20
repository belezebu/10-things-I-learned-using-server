import {APIGatewayProxyResult} from "aws-lambda";
import {init, lambdaWrapper} from 'epsagon'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import captureCorrelationIds from '@dazn/lambda-powertools-middleware-correlation-ids'
import Logger from '@dazn/lambda-powertools-logger'
import flow from 'lodash.flow'
import {createAPIResponse} from "../utils/utils";

init({
    token: process.env.EPSAGON_TOKEN,
    appName: process.env.APP_NAME,
    metadataOnly: false,
});

const helloWorldHandler = async (): Promise<APIGatewayProxyResult> => {
    Logger.info('Returning Hello World Response')
    return createAPIResponse(200, {message: 'Hello World'});
}

export default flow([lambdaWrapper])(middy(helloWorldHandler).use(captureCorrelationIds({sampleDebugLogRate: 1.0})).use(httpErrorHandler()))