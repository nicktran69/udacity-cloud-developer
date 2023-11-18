import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AccountUpdate } from "../../models/accountUpdate";
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/LoggerUtils'

const logger = createLogger('accountsAccess')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)


export class UpdateAccountItemByIdAndUsrIdPersistence {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly accountTable = process.env.ACCOUNTS_TABLE) {
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
}