import * as path from 'path';
import * as SUT from '../../playwright-fluent';
describe('Playwright Fluent - clickAtPosition', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should click at given position - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'click-at-position.test.html')}`;
    const switchContainer = p.selector('#switch-container');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .hover(switchContainer)
      .expectThat(switchContainer.find('input'))
      .isUnchecked();

    const leftPointOfContainer = (await switchContainer.leftPosition()) ?? { x: -100, y: -100 };
    await p.clickAtPosition({ x: leftPointOfContainer.x + 10, y: leftPointOfContainer.y });

    // Then
    await p.expectThat(switchContainer.find('input')).isChecked();
  });
});
