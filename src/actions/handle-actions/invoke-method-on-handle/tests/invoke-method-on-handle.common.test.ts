import { ElementHandle } from 'playwright';
import * as SUT from '../index';

describe('invoke method on handle', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should throw an error when the selector is undefined', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot invoke method 'click' on 'foobar' because selector was not found in DOM",
    );

    await SUT.invokeMethodOnHandle('click', handle, 'foobar').catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should throw an error when the selector is null', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    // Then
    const expectedError = new Error(
      "Cannot invoke method 'click' on 'foobar' because selector was not found in DOM",
    );

    await SUT.invokeMethodOnHandle('click', handle, 'foobar').catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
