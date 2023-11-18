import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoUpdate } from "../../models/TodoUpdate";
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/LoggerUtils'

const logger = createLogger('todosAccess')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)


export class UpdateToDoItemByIdAndUsrIdPersistence {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE) {
    }

    async updateToDoItemByIdAndUsrId(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<void> {
        logger.info(`Update todos item id:${todoId}  of user: ${userId}`)
    
        await this.docClient.update({
          TableName: this.todoTable,
          Key: {
              "userId": userId,
              "todoId": todoId
          },
          UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
          ExpressionAttributeValues: {
              ":name": todoUpdate.name,
              ":dueDate": todoUpdate.dueDate,
              ":done": todoUpdate.done
          },
        });
    }
}