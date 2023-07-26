import { ElementHandle } from 'playwright';
import * as SUT from '../index';

describe('get attribute of handle', (): void => {
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
