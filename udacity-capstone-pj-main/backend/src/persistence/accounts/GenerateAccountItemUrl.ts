import { Types } from 'aws-sdk/clients/s3';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/LoggerUtils'

const logger = createLogger('accountsAccess')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)


export class GenerateAccountItemPersistence {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly accountTable = process.env.ACCOUNTS_TABLE,
    private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
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
}