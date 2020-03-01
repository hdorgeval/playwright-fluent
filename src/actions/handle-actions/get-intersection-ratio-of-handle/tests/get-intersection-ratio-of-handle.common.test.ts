import * as SUT from '../index';
import { ElementHandle } from 'playwright';

describe('get intersection ratio of handle', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should return -1 when selector is undefined - chromium', async (): Promise<void> => {
    // Given
    const selector: ElementHandle | undefined = undefined;

    // When
    const result = await SUT.getIntersectionRatioOfHandle(selector);

    // Then
    expect(result).toBe(-1);
  });

  test('should return -1 when selector is null - chromium', async (): Promise<void> => {
    // Given
    const selector: ElementHandle | null = null;

    // When
    const result = await SUT.getIntersectionRatioOfHandle(selector);

    // Then
    expect(result).toBe(-1);
  });
});
