import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import {generateAccountItemUploadUrl} from "../../services/AccountServices";
import * as uuid from "uuid";
import {decodeJWTToken} from "../../utils/JWTTokenUtils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // account: Return a presigned URL to upload a file for a account item with the provided id
    console.log("Processing Upload Event ", event);
    const accountId = event.pathParameters.accountId;
    const token = decodeJWTToken(event);
    const imageId = uuid.v4();

    const URL: String = await generateAccountItemUploadUrl(
        accountId,
        imageId,
        token
      );

    return {
        statusCode: 202,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            uploadUrl: URL,
        })
    };
};