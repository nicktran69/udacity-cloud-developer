import {TodoItem} from "../models/TodoItem";
import {parseUserId} from "../auth/AuthUtils";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {CreateToDoPersistence} from "../persistence/todos/CreateTodo";
import {GenerateToDoItemPersistence} from "../persistence/todos/GenerateToDoItemUrl";
import {DeleteToDoItemByIdAndUsrIdPersistence} from "../persistence/todos/DeleteToDoItemByIdAndUsrId";
import {GetAllToDoPersistence} from "../persistence/todos/GetAllTodoItem";
import {UpdateToDoItemByIdAndUsrIdPersistence} from "../persistence/todos/UpdateToDoItemByIdAndUsrId";

const uuidv4 = require('uuid/v4');
const createToDoPersistence = new CreateToDoPersistence();
const generateToDoItemPersistence = new GenerateToDoItemPersistence();
const deleteToDoItemByIdAndUsrIdPersistence = new DeleteToDoItemByIdAndUsrIdPersistence();
const getAllToDoPersistence = new GetAllToDoPersistence();
const updateToDoItemByIdAndUsrIdPersistence = new UpdateToDoItemByIdAndUsrIdPersistence();


export async function getAllToDoItems(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return getAllToDoPersistence.getAllTodoItem(userId);
}

export function generateTodoItemUploadUrl(todoId: string, imageId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return generateToDoItemPersistence.generateUploadTodoItemUrl(todoId, imageId, userId);
}

export function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const userId = parseUserId(jwtToken);
    const todoId =  uuidv4();
    const s3BucketName = process.env.S3_BUCKET_NAME;
    
    return createToDoPersistence.createToDoItem({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export function updateToDoItem(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<void> {
    const userId = parseUserId(jwtToken);
    return updateToDoItemByIdAndUsrIdPersistence.updateToDoItemByIdAndUsrId(updateTodoRequest, todoId, userId);
}

export function deleteToDoItem(todoId: string, jwtToken: string): Promise<void> {
    const userId = parseUserId(jwtToken);
    return deleteToDoItemByIdAndUsrIdPersistence.deleteToDoItemByIdAndUsrId(todoId, userId);
}