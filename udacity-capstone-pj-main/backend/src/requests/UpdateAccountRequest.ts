/**
 * Fields in a request to update a single account item.
 */
export interface UpdateAccountRequest {
  name: string
  dueDate: string
  done: boolean
}