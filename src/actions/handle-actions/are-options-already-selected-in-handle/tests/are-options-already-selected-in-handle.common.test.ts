import * as SUT from '../index';
import { ElementHandle } from 'playwright';

describe('are options already selected in handle', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
