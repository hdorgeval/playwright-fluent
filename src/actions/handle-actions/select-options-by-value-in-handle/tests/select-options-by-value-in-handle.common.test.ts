import { ElementHandle } from 'playwright';
import * as SUT from '../index';
import { defaultSelectOptions } from '../../select-options-in-handle';

describe('select options by value in handle', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  test('should throw an error when selector is undefined', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot select options 'foo,bar' because no browser has been launched",
    );

    await SUT.selectOptionsByValueInHandle(
      handle,
      'foobar',
      ['foo', 'bar'],
      undefined,
      defaultSelectOptions,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });

  test('should throw an error when selector is null', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    // Then
    const expectedError = new Error(
      "Cannot select options 'foo,bar' because no browser has been launched",
    );

    await SUT.selectOptionsByValueInHandle(
      handle,
      'foobar',
      ['foo', 'bar'],
      undefined,
      defaultSelectOptions,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });
});
