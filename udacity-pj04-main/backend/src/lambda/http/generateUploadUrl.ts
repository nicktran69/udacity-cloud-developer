import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import {generateTodoItemUploadUrl} from "../../services/ToDoServices";
import * as uuid from "uuid";
import {decodeJWTToken} from "../../utils/JWTTokenUtils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    console.log("Processing Upload Event ", event);
    const todoId = event.pathParameters.todoId;
    const token = decodeJWTToken(event);
    const imageId = uuid.v4();

    const URL: String = await generateTodoItemUploadUrl(
        todoId,
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