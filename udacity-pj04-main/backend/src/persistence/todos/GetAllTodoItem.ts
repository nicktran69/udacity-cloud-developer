import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from "../../models/TodoItem";
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/LoggerUtils'

const logger = createLogger('todosAccess')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)


export class GetAllToDoPersistence {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE) {
    }

    async getAllTodoItem(userId: string): Promise<TodoItem[]> {
    logger.info(`Get all todos item of user: ${userId}`)
    const todos = await this.docClient.query({
        TableName: this.todoTable,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
        ":userId": userId,
        }
    }).promise();
    const result = todos.Items

    return result as TodoItem[];
    }
}