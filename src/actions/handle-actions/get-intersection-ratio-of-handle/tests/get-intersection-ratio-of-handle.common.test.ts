import { ElementHandle } from 'playwright';
import * as SUT from '../index';

describe('get intersection ratio of handle', (): void => {
  beforeEach((): void => {});

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
