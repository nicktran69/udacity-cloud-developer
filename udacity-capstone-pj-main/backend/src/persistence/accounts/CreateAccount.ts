import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AccountItem } from "../../models/AccountItem";
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/LoggerUtils'

const logger = createLogger('accountsAccess')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)


export class CreateAccountPersistence {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly accountTable = process.env.ACCOUNTS_TABLE) {
    }

    async createAccountItem(accountItem: AccountItem): Promise<AccountItem> {
      logger.info(`Create account item: ${accountItem.accountId}`)
  
      await this.docClient.put({
        TableName: this.accountTable,
        Item: accountItem,
      }).promise();

      return accountItem;
    }
}