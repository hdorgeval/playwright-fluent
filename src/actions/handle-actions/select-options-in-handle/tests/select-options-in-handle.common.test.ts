import { ElementHandle } from 'playwright';
import * as SUT from '../index';
import { defaultSelectOptions } from '../select-options-in-handle';

describe('select options in handle', (): void => {
  beforeEach((): void => {});
  test('should throw an error when browser is not launched', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot select options 'foo,bar' because no browser has been launched",
    );

    await SUT.selectOptionsInHandle(
      handle,
      'foobar',
      ['foo', 'bar'],
      undefined,
      defaultSelectOptions,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });
});
