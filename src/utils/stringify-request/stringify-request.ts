import { Request, Response } from '../../actions';

export interface RequestInfo {
  url: string;
  method: string;
  error: {
    errorText: string;
  } | null;
  headers: { [key: string]: string };
  postData: string | unknown | undefined;
  response: ResponseInfo | null;
}

export interface ResponseInfo {
  headers: { [key: string]: string };
  status: number;
  payload: string | unknown | undefined;
}

function toJsonOrDefault(data: string | undefined): string | undefined | unknown {
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
    return await response.text();
  }
}
export async function stringifyRequest(request: Request): Promise<string> {
  const requestInfo: RequestInfo = {
    url: request.url(),
    method: request.method(),
    error: request.failure(),
    headers: request.headers(),
    postData: toJsonOrDefault(request.postData()),
    response: null,
  };

  const response = request.response();
  if (response === null) {
    const result = JSON.stringify(requestInfo, null, 2);
    return result;
  }

  let responseBody: string | unknown | undefined = undefined;
  try {
    responseBody = await toJsonOrText(response);
  } catch (error) {
    // ignore error
  }

  const responseInfo: ResponseInfo = {
    status: response.status(),
    headers: response.headers(),
    payload: responseBody,
  };

  requestInfo.response = responseInfo;
  const result = JSON.stringify(requestInfo, null, 2);
  return result;
}
