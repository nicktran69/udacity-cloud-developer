import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import {deleteAccountItem} from "../../services/AccountServices";
import {decodeJWTToken} from "../../utils/JWTTokenUtils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.accountId;
    console.log("Delete account item id: " + id + " by event info: ", event);
    const token = decodeJWTToken(event);
    await deleteAccountItem(id, token);
    return {
        statusCode: 202,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(true),
    }
};
