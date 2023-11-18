import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AccountItem } from "../../models/accountItem";
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/LoggerUtils'

const logger = createLogger('accountsAccess')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)


export class GetAllAccountPersistence {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly accountTable = process.env.ACCOUNTS_TABLE) {
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
}