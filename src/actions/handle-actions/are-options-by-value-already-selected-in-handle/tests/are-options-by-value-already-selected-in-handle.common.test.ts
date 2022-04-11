import { ElementHandle } from 'playwright';
import * as SUT from '../index';

describe('are options (by value) already selected in handle', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  test('should throw an error when no options are passed', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    // Then
    const expectedError = new Error("You must specify at least one option for selector 'foobar'");

    await SUT.areOptionsByValueAlreadySelectedInHandle(handle, 'foobar', []).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
