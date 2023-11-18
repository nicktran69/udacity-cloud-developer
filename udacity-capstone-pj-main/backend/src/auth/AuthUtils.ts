import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

/**
 * Get Auth Token from header
 * @param authHeader 
 * @returns 
 */
export function getAuthToken(authHeader: string): string {
  if (!authHeader) {
    throw new Error('Authentication header not found');
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Authentication header is invalid');
  }

  const split = authHeader.split(' ');
  const authToken = split[1];

  return authToken;
}