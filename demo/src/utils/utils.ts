import { APIGatewayProxyResult } from 'aws-lambda';

export const createAPIResponse = (
  statusCode: number,
  body: any
): APIGatewayProxyResult => ({
  statusCode,
  body: typeof body === 'string' ? body : JSON.stringify(body)
});
