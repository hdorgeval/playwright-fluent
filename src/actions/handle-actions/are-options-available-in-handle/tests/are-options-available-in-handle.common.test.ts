import * as SUT from '../index';
import { ElementHandle } from 'playwright';

describe('are options available in handle', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  test('should throw an error when no options are passed', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot check that options are available in selector 'foobar' because no options were provided.",
    );

    await SUT.areOptionsAvailableInHandle(handle, 'foobar', []).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
