import * as SUT from '../../playwright-fluent';
import * as path from 'path';

describe('Playwright Fluent - onRequestTo(url).respondFromHar()', (): void => {
  let p: SUT.PlaywrightFluent;

  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should load github web site from HAR file', async (): Promise<void> => {
    // Given
    const harFile = path.join(__dirname, 'github.com.har');
    const foundUrls: string[] = [];
    const notFoundUrls: string[] = [];
    const options: Partial<SUT.HarRequestResponseOptions> = {
      onHarEntryNotFound: (_allEntries, requestedUrl, requestedMethod) => {
        notFoundUrls.push(`not found url : ${requestedMethod} '${requestedUrl}'`);
      },
      onHarEntryFound: (_foundEntry, requestedUrl, requestedMethod) => {
        foundUrls.push(`found url : ${requestedMethod} '${requestedUrl}'`);
      },
      filterHarEntryByPostData: (requestPostData, harRequestPostData) => {
        if (requestPostData === harRequestPostData.text) {
          return true;
        }

        return false;
      },
      provideEntryOnHarEntryNotFound: (request, allEntries) => {
        const requestedUrl = request.url();
        if (requestedUrl.includes('/browser/stats')) {
          // eslint-disable-next-line no-console
          console.log(`manually select entry for POST ${requestedUrl}`);
          return (
            allEntries
              .filter((entry) => entry.request.method === 'POST')
              .filter((entry) => entry.request.url === requestedUrl)
              .pop() || null
          );
        }

        if (
          requestedUrl.startsWith('https://collector.githubapp.com/github/page_view?dimensions')
        ) {
          // eslint-disable-next-line no-console
          console.log(`manually select entry for GET ${requestedUrl}`);
          return (
            allEntries
              .filter((entry) => entry.request.method === 'GET')
              .filter((entry) =>
                entry.request.url.startsWith(
                  'https://collector.githubapp.com/github/page_view?dimensions',
                ),
              )
              .pop() || null
          );
        }

        return null;
      },
    };

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .onRequestTo('/')
      .respondFromHar([harFile], options);

    await p.navigateTo('https://github.com/');

    // Then
    const signupButton = p.selector('button').withText('Sign up for GitHub');
    await p
      // .hover(signupButton)
      // .expectThat(signupButton)
      // .isVisible()
      .expectThat(signupButton)
      .isEnabled();

    // eslint-disable-next-line no-console
    console.log(foundUrls.join('\n'));

    // eslint-disable-next-line no-console
    console.log(notFoundUrls.join('\n'));
  });
});
