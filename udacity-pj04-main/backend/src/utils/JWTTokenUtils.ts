import { APIGatewayProxyEvent } from 'aws-lambda';

export function decodeJWTToken(event: APIGatewayProxyEvent): string {

    const authorization = event.headers.Authorization;
    const split = authorization.split(" ");
    return split[1];
}