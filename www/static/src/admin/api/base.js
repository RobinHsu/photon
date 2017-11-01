import axios from 'axios';
import {mergeSearch} from '../utils/params';

const baseUrl = '/admin/api';

export async function get(url, data) {
  data = mergeSearch(data);

  if (data) {
    url = url.indexOf('?') === -1 ? `${url}?${data}` : `${url}&${data}`;
  }
  try {
    const res = await axios.get(`${baseUrl}${url}`);
    return handleResponse(res);
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function post(url, data) {
  try {
    const res = await axios.post(`${baseUrl}${url}`, data);
    return handleResponse(res);
  } catch (e) {
    return Promise.reject(e);
  }
}

function handleResponse(res) {
  if (res.status === 200) {
    const {data} = res;
    if (!data.errno) {
      return data;
    }
    throw (data);
  } else {
    throw (res.status);
  }
}
