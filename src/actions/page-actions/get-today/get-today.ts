import { Frame, Page } from 'playwright';
export type DateFormat = 'yyyy-mm-dd' | 'Jun 1, 2021' | 'Jun 01, 2021';
export interface DateTimeFormatOptions {
  locale: string;
  intlOptions: Intl.DateTimeFormatOptions;
}
export async function getToday(
  page: Page | Frame | undefined,
  format?: DateFormat | DateTimeFormatOptions,
): Promise<string> {
  if (!page) {
    throw new Error(`Cannot get today because no browser has been launched`);
  }

  const result = await page.evaluate(
    (format: DateFormat | DateTimeFormatOptions | undefined): string => {
      const now = new Date();
      const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(now);
      const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(now);
      const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(now);

      if (!format) {
        return `${now}`;
      }

      if (typeof format === 'string') {
        switch (format) {
          case 'yyyy-mm-dd':
            return `${year}-${month}-${day}`;

          case 'Jun 1, 2021':
            return new Intl.DateTimeFormat('en', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }).format(now);

          case 'Jun 01, 2021':
            return new Intl.DateTimeFormat('en', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
            }).format(now);

          default:
            return `${now}`;
        }
      }

      try {
        return new Intl.DateTimeFormat(format?.locale, format?.intlOptions).format(now);
      } catch (error) {
        return `${error}`;
      }
    },
    format,
  );

  return result;
}
