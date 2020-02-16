import * as SUT from '../index';
import { defaultHoverOptions } from '../../../handle-actions';
import { Page } from 'playwright';

describe('hover-on-selector', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot hover on 'foobar' because no browser has been launched",
    );
    await SUT.hoverOnSelector('foobar', page, defaultHoverOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
