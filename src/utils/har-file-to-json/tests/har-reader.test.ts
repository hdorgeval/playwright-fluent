import { mockRequest } from './request.mock';
import * as SUT from '../index';
import { getHarDataFrom } from '../index';
import { Request } from 'playwright';
import path from 'path';

describe('har-reader', (): void => {
  test('should find response for an http GET', async (): Promise<void> => {
    // Given
    const harFile = path.join(__dirname, 'har-get.har');
    const harData = getHarDataFrom(harFile);
    const request: Request = {
      ...mockRequest,
      url: () => 'http://localhost:8080/foobar?foo=bar',
      method: () => 'GET',
    };

    // When
    const result = SUT.getHarResponseFor(request, harData);

    // Then
    expect(result).toBeDefined();
  });

  test('should find response for an http POST', async (): Promise<void> => {
    // Given
    const harFile = path.join(__dirname, 'har-post.har');
    const harData = getHarDataFrom(harFile);
    const request: Request = {
      ...mockRequest,
      url: () => 'http://localhost:8080/foobar?foo=bar',
      method: () => 'POST',
      postData: () => '{"foo":"bar"}',
    };

    // When
    const result = SUT.getHarResponseFor(request, harData);

    // Then
    expect(result).toBeDefined();
  });

  test('should not find response for an http POST with unfound postdata', async (): Promise<void> => {
    // Given
    const harFile = path.join(__dirname, 'har-post.har');
    const harData = getHarDataFrom(harFile);
    const request: Request = {
      ...mockRequest,
      url: () => 'http://localhost:8080/foobar?foo=bar',
      method: () => 'POST',
      postData: () => '{"foo":"baz"}',
    };

    // When
    const result = SUT.getHarResponseFor(request, harData);

    // Then
    expect(result).toBeUndefined();
  });
});
