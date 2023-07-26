import { ElementHandle } from 'playwright';
import * as SUT from '../index';

describe('are options already selected in handle', (): void => {
  beforeEach((): void => {});
  test('should throw an error when no options are passed', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    // Then
    const expectedError = new Error("You must specify at least one option for selector 'foobar'");

    await SUT.areOptionsAlreadySelectedInHandle(handle, 'foobar', []).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
