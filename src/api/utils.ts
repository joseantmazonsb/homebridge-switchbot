import { RequestInfo, RequestInit } from 'node-fetch';
import fetch from 'node-fetch';

export function requestAsync<T>(url: RequestInfo, init?: RequestInit | undefined) : Promise<T> {
  return new Promise<T>((resolve, reject) => {
    fetch(url, init)
      .then(res => res.json())
      .then(json => {
        resolve(json as T);
      })
      .catch(e => reject(e));
  });
}