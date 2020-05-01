# playwright-fluent

Fluent API around [Playwright](https://github.com/microsoft/playwright)

[![Build Status](https://travis-ci.org/hdorgeval/playwright-fluent.svg?branch=master)](https://travis-ci.org/hdorgeval/playwright-fluent)
[![Build status](https://ci.appveyor.com/api/projects/status/5gtetagv1onhhn7l?svg=true)](https://ci.appveyor.com/project/hdorgeval/playwright-fluent)
[![npm version](https://img.shields.io/npm/v/playwright-fluent.svg)](https://www.npmjs.com/package/playwright-fluent)

###### [Fluent API](/docs/playwright-fluent.api.md) | [Selector API](/docs/selector.api.md) | [Assertion API](/docs/assertion.api.md) | [FAQ](#faq) | [with jest](https://github.com/hdorgeval/playwright-fluent-ts-jest-starter#playwright-fluent-ts-jest-starter) | [with cucumber-js](https://github.com/hdorgeval/playwright-fluent-ts-cucumber-starter#playwright-fluent-ts-cucumber-starter)

### Installation

```
npm i --save playwright-fluent
```

This will also install Playwright along with its dependencies and the browser binaries. Browser binaries are about 50-100MB each, so expect the installation network traffic to be substantial.

# Usage

```js
import { PlaywrightFluent } from 'playwright-fluent';

const p = new PlaywrightFluent();

await p
  .withBrowser('chromium')
  .withOptions({ headless: false })
  .withCursor()
  .recordPageErrors()
  .recordFailedRequests()
  .emulateDevice('iPhone 6 landscape')
  .navigateTo('https://reactstrap.github.io/components/form/')
  .click('#exampleEmail')
  .typeText('foo.bar@baz.com')
  .pressKey('Tab')
  .expectThatSelector('#examplePassword')
  .hasFocus()
  .typeText("don't tell!")
  .pressKey('Tab')
  .expectThatSelector('#examplePassword')
  .hasClass('is-valid')
  .hover('#exampleCustomSelect')
  .select('Value 3')
  .in('#exampleCustomSelect')
  .close();
```

This package provides also a Selector API that enables to find and target a DOM element or a collection of DOM elements embedded in complex DOM Hierarchy:

```js
const selector = p
  .selector('[role="row"]') // will get all dom elements, within the current page, with the attribute role="row"
  .withText('foobar') // will filter only those that contain the text 'foobar'
  .find('td') // from previous result(s), find all embedded <td> elements
  .nth(2); // take only the second cell

await p.expectThatSelector(selector).hasText('foobar-2');
```

# Usage with Stories

This packgage provides a way to write tests as functional components called `Story`:

`stories.ts`

```js
import { Story, StoryWithProps } from 'playwright-fluent';

export interface StartAppProps {
  browser: BrowserName;
  isHeadless: boolean;
  url: string;
}

// first story: start the App
export const startApp: StoryWithProps<StartAppProps> = async (p, props) => {
  await p
    .withBrowser(props.browser)
    .withOptions({ headless: props.isHeadless })
    .withCursor()
    .navigateTo(props.url);
}

// second story: fill in the form
export const fillForm: Story = async (p) => {
  await p
    .click(selector)
    .select(option)
    .in(customSelect)
    ...;
};
```

`test.ts`

```
import {startApp, fillForm} from 'stories';
import { PlaywrightFluent} from 'playwright-fluent';
const p = new PlaywrightFluent();

await p
  .runStory(startApp, {browser: 'chrome', isHeadless: false, url: 'http://example.com'})
  .runStory(fillForm)
  .close();
```

This API is still a draft and is in early development, but stay tuned!

## Contributing

Check out our [contributing guide](./CONTRIBUTING.md).

## Resources

- [Playwright Fluent API documentation](/docs/playwright-fluent.api.md)
- [Selector API documentation](/docs/selector.api.md)
- [Assertion API documentation](/docs/assertion.api.md)

## FAQ

### Q: How does playwright-fluent relate to [Playwright](https://github.com/microsoft/playwright)?

`playwright-fluent` is just a wrapper around the Playwright API.
It leverages the power of Playwright by giving a Fluent API, that enables to consume the Playwright API with chainable actions and assertions.
The purpose of `playwright-fluent` is to be able to write e2e tests in a way that makes tests more readable, reusable and maintainable.

### Q: Can I start using playwright-fluent in my existing code base?

Yes you can.

```js
import { PlaywrightFluent } from 'playwright-fluent';

// just create a new instance with playwright's browser and page instances
const p = new PlaywrightFluent(browser, page);

// now you can use the fluent API
```

### Q: Can I use Playwright together with the playwright-fluent?

Yes you can. To use the Playwright API, call the `currentBrowser()` and/or `currentPage()` methods exposed by the fluent API:

```js
const browser = 'chromium';
const p = new PlaywrightFluent();
await p
  .withBrowser(browser)
  .emulateDevice('iPhone 6 landscape')
  .withCursor()
  .navigateTo('https://reactstrap.github.io/components/form/')
  ...;

// now if you want to use the playwright API from this point:
const browser = p.currentBrowser();
const page = p.currentPage();

// the browser and page objects are standard playwright objects
// so now you are ready to go by using the playwright API
```

### Q: What can I do with the currently published npm package playwright-fluent?

The documentations:

- [Playwright Fluent API documentation](/docs/playwright-fluent.api.md)
- [Selector API documentation](/docs/selector.api.md)
- [Assertion API documentation](/docs/assertion.api.md)

reflect the current status of the development and are inline with the published package.

### Q: Do you have some samples on how to use this library with jest?

Yes, have a look to this [starter project](https://github.com/hdorgeval/playwright-fluent-ts-jest-starter#playwright-fluent-ts-jest-starter).
