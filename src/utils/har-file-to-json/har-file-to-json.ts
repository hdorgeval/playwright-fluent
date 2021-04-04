import { fileDoesNotExist } from '../fs/fs';
import { HttpHeaders } from '../stringify-request';
import { readFileSync } from 'fs';
export type MimeType =
  | 'application/javascript'
  | 'application/json'
  | 'application/json; charset=UTF-8'
  | 'application/x-www-form-urlencoded; charset=UTF-8'
  | 'font/woff2'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/png'
  | 'image/vnd.microsoft.icon'
  | 'image/webp'
  | 'text/css'
  | 'text/html; charset=utf-8'
  | 'text/html'
  | 'text/javascript'
  | 'text/plain';

export interface HarPage {
  startedDateTime: string;
  id: string;
  title: string;
}

export interface HarEntry {
  startedDateTime: string;
  request: HarRequest;
  response: HarResponse;
}

export interface HarRequest {
  method: string;
  url: string;
  headers: HarHeader[];
  postData: {
    mimeType: MimeType;
    text: string;
  };
}

export interface HarHeader {
  name: string;
  value: string;
}

export interface HarResponse {
  status: number;
  statusText: string;
  httpVersion: string;
  headers: HarHeader[];
  content: {
    mimeType: string;
    text: string;
    encoding: 'base64';
  };
}

export interface HarData {
  log: {
    version: string;
    creator: {
      name: string;
      version: string;
    };
    browser: {
      name: string;
      version: string;
    };
    pages: HarPage[];
    entries: HarEntry[];
  };
}

export function getHarDataFrom(filepath: string | undefined): HarData {
  if (!filepath) {
    throw new Error(
      `HAR filepath has not been setup. Ensure you have called 'recordNetworkActivity({path: <valid file path>})'.`,
    );
  }

  if (fileDoesNotExist(filepath)) {
    throw new Error(
      `File '${filepath}' does not exist. Ensure you have called 'recordNetworkActivity({path: ${filepath}})' and that you have closed the browser. HAR data is only saved to disk when the browser is closed.`,
    );
  }

  const harData = JSON.parse(readFileSync(filepath, 'utf8')) as HarData;
  return harData;
}

export function getHarResponseContentAs<T>(harResponse: HarResponse | undefined): T {
  const base64EncodedContent = harResponse?.content?.text;
  if (!base64EncodedContent) {
    return {} as T;
  }
  const rawContent = Buffer.from(base64EncodedContent, 'base64').toString('utf8');
  if (!rawContent) {
    return {} as T;
  }
  try {
    return JSON.parse(rawContent) as T;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (rawContent as any) as T;
  }
}

export function harHeadersToHttpHeaders(headers: HarHeader[] | undefined): HttpHeaders {
  const keyValueHeaders = {} as HttpHeaders;
  if (!Array.isArray(headers)) {
    return keyValueHeaders;
  }

  headers.forEach((header) => {
    keyValueHeaders[header.name] = header.value;
  });

  return keyValueHeaders;
}
