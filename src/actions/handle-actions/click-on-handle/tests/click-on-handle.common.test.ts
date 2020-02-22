import * as SUT from '../index';
import { defaultClickOptions } from '../click-on-handle';
import { ElementHandle } from 'playwright';

describe('click on handle', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should throw an error when the browser has not been launched', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot click on 'foobar' because no browser has been launched",
    );

    await SUT.clickOnHandle(handle, 'foobar', undefined, defaultClickOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
