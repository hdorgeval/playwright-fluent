import { PlaywrightFluent } from '../../fluent-api';

describe('Selector API - AG Grid samples', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test.skip('should select a name in the grid', async (): Promise<void> => {
    // Given I open The AG Grid demo site
    const url = 'https://www.ag-grid.com/example.php';
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withCursor()
      .withOptions({headless: false})
      .navigateTo(url);

    // When I select Olivia Brenan's name
    const agGridContainer = p.selector('div.ag-body-viewport');
    const checkbox = agGridContainer
      .find('div[role="row"]')
      .withText('Olivia Brennan')
      .nth(1) // take the first row that contains 'Olivia Brennan'
      .find('div[col-id="name"]') // take the cell in column name
      .find('span.ag-selection-checkbox'); // take the checkbox in that cell

    const handle = await checkbox.getFirstHandleOrNull(); // get the Playwright's element handle

    await handle!.hover();

    await handle!.click();

    // Then
    expect(handle).not.toBeNull();
    // eslint-disable-next-line no-console
    console.log(checkbox.toString());
  });
});
