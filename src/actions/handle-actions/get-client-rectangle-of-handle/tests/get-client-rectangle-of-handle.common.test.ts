import * as SUT from '../index';
import { ElementHandle } from 'playwright';

describe('get client rectangle of an element handle', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should return null when selector is null', async (): Promise<void> => {
    // Given
    const selector: ElementHandle<Element> | null | undefined = null;

    // When
    const result = await SUT.getClientRectangleOfHandle(selector);

    // Then
    expect(result).toBe(null);
  });

  test('should return null when selector is undefined', async (): Promise<void> => {
    // Given
    const selector: ElementHandle<Element> | null | undefined = undefined;

    // When
    const result = await SUT.getClientRectangleOfHandle(selector);

    // Then
    expect(result).toBe(null);
  });
});
