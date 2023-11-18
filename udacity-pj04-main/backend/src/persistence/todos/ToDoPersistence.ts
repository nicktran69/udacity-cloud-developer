import { Types } from 'aws-sdk/clients/s3';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from "../../models/TodoItem";
import { TodoUpdate } from "../../models/TodoUpdate";
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/LoggerUtils'

const logger = createLogger('todosAccess')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class ToDoPersistence {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
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

  async generateUploadTodoItemUrl(todoId: string, imageId: String, userId: String): Promise<string> {
    logger.info(`Generating.. attachment URL: todo ${todoId}, ${userId} `)

    const attachmentUrl = await this.s3Client.getSignedUrl('putObject', {
        Bucket: this.s3BucketName,
        Key: todoId,
        Expires: 2000,
    });

    await this.docClient.update({
      TableName: this.todoTable,
      Key: {
      todoId,
      userId
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
      ":attachmentUrl": `https://${this.s3BucketName}.s3.amazonaws.com/${imageId}`,
      },
    });

    return attachmentUrl;
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

  async deleteToDoItemByIdAndUsrId(todoId: string, userId: string): Promise<void> {
    console.log("Delete Id: ", todoId, " userId: ", userId);
    this.docClient.delete({
      TableName: this.todoTable,
      Key: {
        "todoId": todoId,
        "userId": userId
      },
    });
  }
}
