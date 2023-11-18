import { Types } from 'aws-sdk/clients/s3';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AccountItem } from "../../models/accountItem";
import { AccountUpdate } from "../../models/accountUpdate";
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/LoggerUtils'

const logger = createLogger('accountsAccess')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class accountPersistence {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly accountTable = process.env.ACCOUNTS_TABLE,
    private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
  }
  
  async createAccountItem(accountItem: AccountItem): Promise<AccountItem> {
    logger.info(`Create account item: ${accountItem.accountId}`)

    this.docClient
    .put({
      TableName: this.accountTable,
      Item: accountItem,
    })
    .promise();

  return accountItem;
  }

  async generateUploadAccountItemUrl(accountId: string, imageId: String, userId: String): Promise<string> {
    logger.info(`Generating.. attachment URL: account ${accountId}, ${userId} `)

    const attachmentUrl = await this.s3Client.getSignedUrl('putObject', {
        Bucket: this.s3BucketName,
        Key: accountId,
        Expires: 2000,
    });

    await this.docClient.update({
      TableName: this.accountTable,
      Key: {
      accountId,
      userId
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
      ":attachmentUrl": `https://${this.s3BucketName}.s3.amazonaws.com/${imageId}`,
      },
    });

    return attachmentUrl;
  }

  async getAllAccountItem(userId: string): Promise<AccountItem[]> {
    logger.info(`Get all accounts item of user: ${userId}`)

    const accounts = await this.docClient.query({
      TableName: this.accountTable,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      }
    }).promise();
    const result = accounts.Items

    return result as AccountItem[];
  }

  async updateAccountItemByIdAndUsrId(accountUpdate: AccountUpdate, accountId: string, userId: string): Promise<void> {
    logger.info(`Update accounts item id:${accountId}  of user: ${userId}`)

    await this.docClient.update({
      TableName: this.accountTable,
      Key: {
          "userId": userId,
          "accountId": accountId
      },
      UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
      ExpressionAttributeValues: {
          ":name": accountUpdate.name,
          ":dueDate": accountUpdate.dueDate,
          ":done": accountUpdate.done
      },
    });
  }

  async deleteAccountItemByIdAndUsrId(accountId: string, userId: string): Promise<void> {
    logger.info("Delete Id: ", accountId, " userId: ", userId);
    this.docClient.delete({
      TableName: this.accountTable,
      Key: {
        "accountId": accountId,
        "userId": userId
      },
    });
  }
}
