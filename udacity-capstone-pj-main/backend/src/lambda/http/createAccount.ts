import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {CreateAccountRequest} from '../../requests/CreateAccountRequest';
import {createAccount} from "../../services/AccountServices";
import {decodeJWTToken} from "../../utils/JWTTokenUtils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newAccountItem: CreateAccountRequest = JSON.parse(event.body);
    console.log("Crete new todo item:" + newAccountItem + "with event: ", event);
    const token = decodeJWTToken(event);
    const accountItem = await createAccount(newAccountItem, token);

    return {
        statusCode: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "item": accountItem
        }),
    }
};
