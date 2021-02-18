import * as SUT from '../index';
import { ElementHandle } from 'playwright';

describe('invoke method on handle', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

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
