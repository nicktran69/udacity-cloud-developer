import {AccountItem} from "../models/accountItem";
import {parseUserId} from "../auth/AuthUtils";
import {CreateAccountRequest} from "../requests/CreateAccountRequest";
import {UpdateAccountRequest} from "../requests/UpdateAccountRequest";
import {CreateAccountPersistence} from "../persistence/accounts/CreateAccount";
import {GenerateAccountItemPersistence} from "../persistence/accounts/GenerateAccountItemUrl";
import {DeleteAccountItemByIdAndUsrIdPersistence} from "../persistence/accounts/DeleteAccountItemByIdAndUsrId";
import {GetAllAccountPersistence} from "../persistence/accounts/GetAllAccountItem";
import {UpdateAccountItemByIdAndUsrIdPersistence} from "../persistence/accounts/UpdateAccountItemByIdAndUsrId";

const uuidv4 = require('uuid/v4');
const createaccountPersistence = new CreateAccountPersistence();
const generateaccountItemPersistence = new GenerateAccountItemPersistence();
const deleteaccountItemByIdAndUsrIdPersistence = new DeleteAccountItemByIdAndUsrIdPersistence();
const getAllaccountPersistence = new GetAllAccountPersistence();
const updateaccountItemByIdAndUsrIdPersistence = new UpdateAccountItemByIdAndUsrIdPersistence();


export async function getAllAccountItems(jwtToken: string): Promise<AccountItem[]> {
    const userId = parseUserId(jwtToken);
    return getAllaccountPersistence.getAllAccountItem(userId);
}

export async function generateAccountItemUploadUrl(accountId: string, imageId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return generateaccountItemPersistence.generateUploadAccountItemUrl(accountId, imageId, userId);
}

export async function createAccount(createaccountRequest: CreateAccountRequest, jwtToken: string): Promise<AccountItem> {
    const userId = parseUserId(jwtToken);
    const accountId =  uuidv4();
    const s3BucketName = process.env.S3_BUCKET_NAME;
    
    return createaccountPersistence.createAccountItem({
        userId: userId,
        accountId: accountId,
        createdAt: new Date().getTime().toString(),
        name:createaccountRequest.name,
        dueDate: createaccountRequest.dueDate,
        done: false,
        attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${accountId}`
    });
}

export async function updateAccountItem(updateaccountRequest: UpdateAccountRequest, accountId: string, jwtToken: string): Promise<void> {
    const userId = parseUserId(jwtToken);
    return updateaccountItemByIdAndUsrIdPersistence.updateAccountItemByIdAndUsrId(updateaccountRequest, accountId, userId);
}

export async function deleteAccountItem(accountId: string, jwtToken: string): Promise<void> {
    const userId = parseUserId(jwtToken);
    return deleteaccountItemByIdAndUsrIdPersistence.deleteAccountItemByIdAndUsrId(accountId, userId);
}