import { ElementHandle } from 'playwright';
import * as SUT from '../index';
import { defaultDoubleClickOptions } from '../double-click-on-handle';

describe('double-click on handle', (): void => {
  beforeEach((): void => {});

  test('should throw an error when the browser has not been launched', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot double-click on 'foobar' because no browser has been launched",
    );

    await SUT.doubleClickOnHandle(handle, 'foobar', undefined, defaultDoubleClickOptions).catch(
      (error): void => expect(error).toMatchObject(expectedError),
    );
  });
});
