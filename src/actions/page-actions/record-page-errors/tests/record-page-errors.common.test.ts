import { Page } from 'playwright';
import * as SUT from '../index';

describe('record page errors', (): void => {
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
