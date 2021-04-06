import * as SUT from '../index';
import { Page } from 'playwright';

describe('record requests to', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const requests: SUT.Request[] = [];
    const callback = (request: SUT.Request) => requests.push(request);
    const takeAllPredicate = () => false;

    // When
    // Then
    const expectedError = new Error(
      "Cannot record requests to '/foobar' because no browser has been launched",
    );
    await SUT.recordRequestsTo('/foobar', takeAllPredicate, page, callback).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
