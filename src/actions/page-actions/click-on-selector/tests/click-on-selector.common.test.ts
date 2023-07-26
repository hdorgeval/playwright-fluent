import { Page } from 'playwright';
import * as SUT from '../index';
import { defaultClickOptions } from '../../../handle-actions';

describe('click-on-selector', (): void => {
  beforeEach((): void => {});

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot click on 'foobar' because no browser has been launched",
    );
    await SUT.clickOnSelector('foobar', page, defaultClickOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
