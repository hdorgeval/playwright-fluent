import * as path from 'path';
import * as SUT from '../../playwright-fluent';
describe('Playwright Fluent - runStory', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should chain two stories - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'run-story.test.html')}`;
    const selector = 'select#selectWithBlankOption';

    interface StartAppProps {
      browser: SUT.BrowserName;
      isHeadless: boolean;
      url: string;
    }

    const startApp: SUT.StoryWithProps<StartAppProps> = async (p, props) => {
      await p
        .withBrowser(props.browser)
        .withOptions({ headless: props.isHeadless })
        .withCursor()
        .navigateTo(props.url);
    };

    const selectLabel: SUT.StoryWithProps<string> = async (p, label) => {
      await p.select(label).in(selector);
    };

    // When
    await p
      .runStory(startApp, { browser: 'chromium', isHeadless: false, url })
      .runStory(selectLabel, 'label 2');

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('value 2');
  });

  test('should run embedded stories - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'run-story.test.html')}`;
    const selector = 'select#selectWithBlankOption';

    interface StartAppProps {
      browser: SUT.BrowserName;
      isHeadless: boolean;
      url: string;
    }

    const startApp: SUT.StoryWithProps<StartAppProps> = async (p, props) => {
      await p
        .withBrowser(props.browser)
        .withOptions({ headless: props.isHeadless })
        .withCursor()
        .navigateTo(props.url);
    };

    const selectLabel: SUT.StoryWithProps<string> = async (p, label) => {
      await p.select(label).in(selector);
    };

    const mainStory: SUT.Story = async (p) => {
      await p
        .runStory(startApp, { browser: 'chromium', isHeadless: false, url })
        .runStory(selectLabel, 'label 2');
    };

    // When
    await p.runStory(mainStory);

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('value 2');
  });
  test('should combine stories - chromium', async (): Promise<void> => {
    // Given
    const results: string[] = [];

    const storyA1: SUT.Story = async (p) => {
      results.push('storyA1');
      await p.expectThatAsyncFunc(async () => true).resolvesTo(true);
    };

    const storyA2: SUT.Story = async (p) => {
      results.push('storyA2');
      await p.expectThatAsyncFunc(async () => true).resolvesTo(true);
    };

    const storyA: SUT.Story = async (p) => {
      results.push('storyA');
      // prettier-ignore
      await p
        .runStory(storyA1)
        .and(storyA2);
    };

    const storyB1: SUT.Story = async (p) => {
      results.push('storyB1');
      await p.expectThatAsyncFunc(async () => true).resolvesTo(true);
    };

    const storyB2: SUT.Story = async (p) => {
      results.push('storyB2');
      await p.expectThatAsyncFunc(async () => true).resolvesTo(true);
    };

    const storyB: SUT.Story = async (p) => {
      results.push('storyB');
      // prettier-ignore
      await p
        .do(storyB1)
        .and(storyB2);
    };

    const mainStory: SUT.Story = async (p) => {
      // prettier-ignore
      await p.attemptsTo(storyA);
      await p.and(storyB);
    };

    // When
    await p.verifyIf(mainStory);

    // Then
    expect(results.join()).toBe('storyA,storyA1,storyA2,storyB,storyB1,storyB2');
  });
});
