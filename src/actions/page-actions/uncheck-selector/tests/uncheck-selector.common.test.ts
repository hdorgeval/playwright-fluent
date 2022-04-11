import { Page } from 'playwright';
import * as SUT from '../index';
import { defaultCheckOptions } from '../../../handle-actions';

describe('uncheck-selector', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error("Cannot uncheck 'foobar' because no browser has been launched");
    await SUT.uncheckSelector('foobar', page, defaultCheckOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
