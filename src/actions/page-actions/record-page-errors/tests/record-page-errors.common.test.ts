import * as SUT from '../index';
import { Page } from 'playwright';

describe('record page errors', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const errors: Error[] = [];
    const callback = (error: Error) => errors.push(error);

    // When
    // Then
    const expectedError = new Error(
      'Cannot record page errors because no browser has been launched',
    );
    await SUT.recordPageErrors(page, callback).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
