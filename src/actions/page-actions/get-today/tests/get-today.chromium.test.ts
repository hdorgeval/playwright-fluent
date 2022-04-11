import { Browser, chromium } from 'playwright';
import * as SUT from '../index';

describe('get today date of page', (): void => {
  let browser: Browser | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });
  test('should return today - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();

    // When
    const result = await SUT.getToday(page);

    // Then
    expect(result).toBeDefined();
  });

  test('should return today as yyy-mm-dd - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();

    // When
    const result = await SUT.getToday(page, 'yyyy-mm-dd');

    // Then
    expect(result).toBeDefined();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/i);
  });

  test('should return today in short format - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();

    // When
    const result = await SUT.getToday(page, {
      locale: 'en',
      intlOptions: { year: 'numeric', month: 'short', day: '2-digit' },
    });
    const result2 = await SUT.getToday(page, 'Jun 01, 2021');

    // Then
    expect(result).toBe(result2);
  });

  test('should return today as "Apr 15, 2021" - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();

    // When
    const result = await SUT.getToday(page, 'Jun 01, 2021');

    // Then
    expect(result).toBeDefined();
    expect(result).toMatch(/^[A-Z][a-z]{2}\s\d{2},\s\d{4}$/i);
  });

  test('should return an error when option is wrong', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();
    const badIntlOptions = (<unknown>{
      day: 'foobar',
    }) as Intl.DateTimeFormatOptions;

    // When
    const result = await SUT.getToday(page, { locale: 'en', intlOptions: badIntlOptions });

    // Then
    expect(result).toBe(
      'RangeError: Value foobar out of range for Intl.DateTimeFormat options property day',
    );
  });
});
