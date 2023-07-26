import { Page } from 'playwright';
import * as SUT from '../index';
import { defaultDoubleClickOptions } from '../../../handle-actions';

describe('double-click on selector', (): void => {
  beforeEach((): void => {});

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot double-click on 'foobar' because no browser has been launched",
    );
    await SUT.doubleClickOnSelector('foobar', page, defaultDoubleClickOptions).catch(
      (error): void => expect(error).toMatchObject(expectedError),
    );
  });
});
