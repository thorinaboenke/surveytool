import argon2 from 'argon2';
import Tokens from 'csrf';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteUserByUsername,
  getUserByUsername,
  registerUser,
} from '../../util/database';

const tokens = new Tokens();

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'DELETE') {
    const { username } = request.body;
    const token = request.cookies.session;

    const user = await deleteUserByUsername(username, token);
    if (!user) {
      return response.status(401).send({ success: false });
    }
    return response.status(200).send({ success: true });
  }
  // extract the username password and token from the request body (sent on submit by the signup form)
  const { username, password, token } = request.body;

  const passwordEmpty = !password;
  const usernameEmpty = !username;

  if (usernameEmpty) {
    return response.status(400).send({
      success: false,
      message: 'username cannot be empty',
    });
  }
  if (passwordEmpty) {
    return response.status(400).send({
      success: false,

      message: 'password cannot be empty',
    });
  }

  //1) get the secret from the .env file
  const secret = process.env.CSRF_TOKEN_SECRET;
  //2) check if the secret is configured, if not send back a 500 status
  if (typeof secret === 'undefined') {
    console.error('CSRF_TOKEN_SECRET environment variable not configured');
    return response.status(500).send({ success: false });
  }
  //3)check the submitted token against the secret
  const verified = tokens.verify(secret, token);
  // if not verified, send back 401 status (unauthorized)
  if (!verified) {
    return response.status(401).send({
      success: false,
      message: 'invalid token',
    });
  }

  // check if there is already a user in the database with that username
  const usernameAlreadyTaken =
    typeof (await getUserByUsername(username)) !== 'undefined';

  if (usernameAlreadyTaken) {
    // HTTP status code: 409 Conflict
    return response.status(409).send({
      success: false,
      message: 'User already exists',
    });
  }
  // create a hashed version of the password with argon2 and register user in database
  try {
    const passwordHash = await argon2.hash(password);
    await registerUser(username, passwordHash);
  } catch (err) {
    return response.status(501).send({ success: false });
  }

  response.send({ success: true });
}
