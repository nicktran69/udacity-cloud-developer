import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from "../../models/TodoItem";
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/LoggerUtils'

const logger = createLogger('todosAccess')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)


export class CreateToDoPersistence {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE) {
    }

    async createToDoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info(`Create todo item: ${todoItem.todoId}`)
    
        this.docClient
        .put({
          TableName: this.todoTable,
          Item: todoItem,
        })
        .promise();
    
      return todoItem;
    }
}