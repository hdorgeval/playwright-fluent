import { PlaywrightFluent, cast } from '../../playwright-fluent';

describe('Playwright Fluent - cast', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  test('should cast', async (): Promise<void> => {
    // Given
    const p = new PlaywrightFluent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx = {} as any;
    ctx.p = p;

    // When
    const castedInstance = cast(ctx.p);

    // Then
    expect(castedInstance instanceof PlaywrightFluent).toBe(true);
    expect(castedInstance).toBe(p);
  });
});
