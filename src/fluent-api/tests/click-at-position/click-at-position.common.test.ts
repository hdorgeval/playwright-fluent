import * as SUT from '../../playwright-fluent';
import { Point } from '../../playwright-fluent';

describe('Playwright Fluent - click', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on click without launching the browser', async (): Promise<void> => {
    // Given
    const position: Point = { x: 1, y: 2 };
    // When
    let result: Error | undefined = undefined;
    try {
      await p.clickAtPosition(position);
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot click at position 'x: 1, y: 2' because no browser has been launched",
    );
  });
});
