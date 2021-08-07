import { FluentMock } from './with-mocks';

export function validateMock(mock: Partial<FluentMock>): void {
  if (mock.displayName === 'passthroughMock') {
    return;
  }

  if (typeof mock.rawResponse === 'function' && typeof mock.jsonResponse === 'function') {
    throw new Error(
      `mock named '${mock.displayName}' should either implement a json response or a raw response but not both.`,
    );
  }

  if (
    typeof mock.rawResponse === 'function' &&
    typeof mock.responseType === 'string' &&
    mock.responseType === 'json'
  ) {
    throw new Error(
      `mock named '${mock.displayName}' should implement a json response instead of a raw response, because you explicitely set the response type to be json.`,
    );
  }

  if (
    typeof mock.jsonResponse === 'function' &&
    typeof mock.responseType === 'string' &&
    mock.responseType === 'string'
  ) {
    throw new Error(
      `mock named '${mock.displayName}' should implement a raw response instead of a json response, because you explicitely set the response type to be a string.`,
    );
  }

  if (
    typeof mock.jsonResponse === 'function' &&
    typeof mock.responseType === 'string' &&
    mock.responseType === 'empty'
  ) {
    throw new Error(
      `mock named '${mock.displayName}' should not implement a json response, because you explicitely set the response type to be empty.`,
    );
  }

  if (
    typeof mock.rawResponse === 'function' &&
    typeof mock.responseType === 'string' &&
    mock.responseType === 'empty'
  ) {
    throw new Error(
      `mock named '${mock.displayName}' should not implement a raw response, because you explicitely set the response type to be empty.`,
    );
  }
}
