import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/LoggerUtils'

const logger = createLogger('todosAccess')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)


export class DeleteToDoItemByIdAndUsrIdPersistence {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE) {
    }

    async deleteToDoItemByIdAndUsrId(todoId: string, userId: string): Promise<void> {
        logger.info(`Delete Id: id:${todoId}  of user: ${userId}`);
        this.docClient.delete({
            TableName: this.todoTable,
            Key: {
            "todoId": todoId,
            "userId": userId
            },
        });
    }
}