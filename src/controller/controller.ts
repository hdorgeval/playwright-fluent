import { Browser, Page } from 'playwright';
export class PlaywrightController implements PromiseLike<void> {
  then<TResult1 = void, TResult2 = never>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined,
  ): PromiseLike<TResult1 | TResult2> {
    throw new Error('Method not implemented.');
  }
  constructor(browser?: Browser, page?: Page) {
    if (browser && page) {
      this.browser = browser;
      this.page = page;
    }
  }

  private browser: Browser | undefined;
  public currentBrowser(): Browser | undefined {
    return this.browser;
  }
  private page: Page | undefined;
  public currentPage(): Page | undefined {
    return this.page;
  }
}
