import * as SUT from '../index';
import { ElementHandle } from 'playwright';

describe('get attribute of handle', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return null when handle is undefined', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.getAttributeOfHandle('foobar', handle);

    // Then
    expect(result).toBeNull();
  });

  test('should return null when handle is null', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    const result = await SUT.getAttributeOfHandle('foobar', handle);

    // Then
    expect(result).toBeNull();
  });
});
