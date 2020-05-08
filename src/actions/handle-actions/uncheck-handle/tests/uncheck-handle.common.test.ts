import * as SUT from '../index';
import { defaultCheckOptions } from '../../check-handle';
import { ElementHandle } from 'playwright';

describe('uncheck handle', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should throw an error when the browser has not been launched', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    // Then
    const expectedError = new Error("Cannot uncheck 'foobar' because no browser has been launched");

    await SUT.uncheckHandle(handle, 'foobar', undefined, defaultCheckOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
