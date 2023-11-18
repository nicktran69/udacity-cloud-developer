import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/LoggerUtils'

const logger = createLogger('accountsAccess')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)


export class DeleteAccountItemByIdAndUsrIdPersistence {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly accountTable = process.env.ACCOUNTS_TABLE) {
    }

    async deleteAccountItemByIdAndUsrId(accountId: string, userId: string): Promise<void> {
        logger.info(`Delete Id: id:${accountId}  of user: ${userId}`);
        await this.docClient.delete({
            TableName: this.accountTable,
            Key: {
            "accountId": accountId,
            "userId": userId,
            },
        }).promise();
    }
}