import { apiEndpoint } from '../config'
import { account } from '../types/Account';
import { CreateaccountRequest } from '../types/CreateAccountRequest';
import Axios from 'axios'
import { UpdateaccountRequest } from '../types/UpdateAccountRequest';

export async function getaccounts(idToken: string): Promise<account[]> {
  console.log('Fetching accounts')

  const response = await Axios.get(`${apiEndpoint}/accounts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('accounts:', response.data)
  return response.data.items
}

export async function createaccount(
  idToken: string,
  newaccount: CreateaccountRequest
): Promise<account> {
  const response = await Axios.post(`${apiEndpoint}/accounts`,  JSON.stringify(newaccount), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchaccount(
  idToken: string,
  accountId: string,
  updatedaccount: UpdateaccountRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/accounts/${accountId}`, JSON.stringify(updatedaccount), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteaccount(
  idToken: string,
  accountId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/accounts/${accountId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  accountId: string
): Promise<string> {
  try {
    const response = await Axios.post(`${apiEndpoint}/accounts/${accountId}/attachment`, '', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      })
    return response.data.uploadUrl
  }
catch(err){
console.error('get upload url', err)
}
  return ''
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  try {
  await Axios.put(uploadUrl, file)
  } catch(err){
      console.error(" Upload file", err)
}
    
}
