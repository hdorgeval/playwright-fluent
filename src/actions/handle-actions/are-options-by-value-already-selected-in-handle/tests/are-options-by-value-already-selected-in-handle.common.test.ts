import * as SUT from '../index';
import { ElementHandle } from 'playwright';

describe('are options (by value) already selected in handle', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
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
