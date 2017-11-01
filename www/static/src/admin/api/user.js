import {get, post} from './base';

export async function getUser(data) {
  return await get('/user', data);
}

export async function postUser(data) {
  return await post('/user', data);
}
