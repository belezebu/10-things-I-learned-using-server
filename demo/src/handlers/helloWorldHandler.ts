import {APIGatewayEvent, APIGatewayProxyResult} from "aws-lambda";
import {init, lambdaWrapper} from 'epsagon'

init({
    token: process.env.EPSAGON_TOKEN,
    appName: process.env.APP_NAME,
    metadataOnly: false,
});

const createAPIResponse = (
    statusCode: number,
    body: any
): APIGatewayProxyResult => ({
    statusCode,
    body: typeof body === "string" ? body : JSON.stringify(body)
});

const helloWorld = async (
    event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
    return createAPIResponse(200, {ok: true});
}

export default lambdaWrapper(helloWorld)