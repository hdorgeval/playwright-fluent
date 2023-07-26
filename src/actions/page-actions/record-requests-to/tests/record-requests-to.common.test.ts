import { Request, Page } from 'playwright';
import * as SUT from '../index';

describe('record requests to', (): void => {
  beforeEach((): void => {});

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const requests: Request[] = [];
    const callback = (request: Request) => requests.push(request);
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
