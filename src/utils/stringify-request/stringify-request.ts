import { URL } from 'url';
import * as querystring from 'querystring';
import { Request, Response } from 'playwright';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const escapeHtml = require('escape-html');

export interface QueryString {
  [key: string]: string | number | boolean | string[] | number[] | boolean[] | null;
}

export interface HttpHeaders {
  [key: string]: string;
}
export interface RequestInfo {
  url: string;
  queryString: QueryString;
  method: string;
  error: {
    errorText: string;
  } | null;
  headers: HttpHeaders;
  postData: string | unknown | undefined;
  response: ResponseInfo | null;
}

export interface ResponseInfo {
  headers: HttpHeaders;
  payload: string | unknown | undefined;
  status: number;
  statusText: string;
}

function encodeHtml(content: string | unknown | undefined): string | unknown | undefined {
  if (typeof content !== 'string') {
    return content;
  }

  const result = escapeHtml(content);
  return result;
}

function toJsonOrDefault(data: string | null | undefined): string | null | undefined | unknown {
  try {
    if (!data) {
      return data;
    }
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}

async function toJsonOrText(response: Response): Promise<string | unknown> {
  try {
    const payload = await response.json();
    return payload;
  } catch (error) {
    const payload = await response.text();
    return encodeHtml(payload);
  }
}

export function toQueryString(url: string): QueryString {
  try {
    const nodeUrl = new URL(url);
    const rawSearch = nodeUrl.search;
    let rawQueryString = rawSearch;
    if (rawSearch && rawSearch.startsWith('?')) {
      rawQueryString = rawSearch.replace('?', '');
    }
    const query = querystring.parse(rawQueryString) as QueryString;
    return query;
  } catch (error) {
    return {};
  }
}

export async function toRequestInfo(request: Request): Promise<RequestInfo> {
  const requestInfo: RequestInfo = {
    url: request.url(),
    queryString: toQueryString(request.url()),
    method: request.method(),
    error: request.failure(),
    headers: request.headers(),
    postData: toJsonOrDefault(request.postData()),
    response: null,
  };

  const response = await request.response();
  if (response === null) {
    return requestInfo;
  }

  let responseBody: string | unknown | undefined = undefined;
  try {
    responseBody = await toJsonOrText(response);
  } catch (error) {
    // ignore error
  }

  const responseInfo: ResponseInfo = {
    headers: response.headers(),
    payload: responseBody,
    status: response.status(),
    statusText: response.statusText(),
  };

  requestInfo.response = responseInfo;
  return requestInfo;
}

export async function stringifyRequest(request: Request): Promise<string> {
  const requestInfo = await toRequestInfo(request);
  const result = JSON.stringify(requestInfo, null, 2);

  return result;
}
