import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {UpdateAccountRequest} from '../../requests/UpdateaccountRequest'
import {updateAccountItem} from "../../services/AccountServices";
import {decodeJWTToken} from "../../utils/JWTTokenUtils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing Update Event ", event);
    const token = decodeJWTToken(event);
    const id = event.pathParameters.accountId;
    const updateItemsData: UpdateAccountRequest = JSON.parse(event.body);
    const items = await updateAccountItem(updateItemsData, id, token);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "item": items
        }),
    }
};
