import { PlaywrightFluent } from '../../controller';

describe('Selector API - AG Grid samples', (): void => {
  let pwc: PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    pwc = new PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );

  test.skip('should select a name in the grid', async (): Promise<void> => {
    // Given I open The AG Grid demo site
    const url = 'https://www.ag-grid.com/example.php';
    await pwc
      .withBrowser('chromium')
      .withCursor()
      .withOptions({ headless: false })
      .navigateTo(url);

    // When I select Olivia Brenan's name
    const agGridContainer = pwc.selector('div.ag-body-viewport');
    const checkbox = agGridContainer
      .find('div[role="row"]')
      .withText('Olivia Brennan')
      .nth(1) // take the first row that contains 'Olivia Brennan'
      .find('div[col-id="name"]') // take the cell in column name
      .find('span.ag-selection-checkbox'); // take the checkbox in that cell

    const handle = await checkbox.getFirstHandleOrNull(); // get the Playwright's element handle
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await handle!.hover();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await handle!.click();

    // Then
    expect(handle).not.toBeNull();
    // eslint-disable-next-line no-console
    console.log(checkbox.toString());
  });
});
