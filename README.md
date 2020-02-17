# playwright-controller

Fluent API around [Playwright](https://github.com/microsoft/playwright)

[![Build Status](https://travis-ci.org/hdorgeval/playwright-controller.svg?branch=master)](https://travis-ci.org/hdorgeval/playwright-controller)
[![Build status](https://ci.appveyor.com/api/projects/status/dp3o8w5m8b6o0y1s?svg=true)](https://ci.appveyor.com/project/hdorgeval/playwright-controller)
[![npm version](https://img.shields.io/npm/v/playwright-controller.svg)](https://www.npmjs.com/package/playwright-controller)

### Installation

```
npm i --save playwright-controller
```

This will also install Playwright along with its dependencies and the browser binaries. Browser binaries are about 50-100MB each, so expect the installation network traffic to be substantial.

# Usage

```js
import { PlaywrightController } from 'playwright-controller';

const pwc = new PlaywrightController();

await pwc
  .withBrowser('chromium')
  .withOptions({
    headless: false,
  })
  .emulateDevice('iPhone 6 landscape')
  .withCursor()
  .navigateTo('https://reactstrap.github.io/components/form/')
  .click('#exampleEmail')
  .typeText('foo.bar@baz.com')
  .pressKey('Tab');
  .expectThat('#examplePassword').hasFocus()
  .typeText("don't tell!")
  .pressKey('Tab');
  .expectThat(passwordInputSelector).hasClass('is-valid')
  .hover('#exampleCustomSelect')
  .select('Value 3').in('#exampleCustomSelect')
  .close();
```

This API will provide a Selector Fluent API that will enable to find and target a DOM element or a collection of DOM elements that is embedded in complex DOM Hierarchy:

```js
const selector = pwc
  .selector('[role="row"]') // will get all dom elements, within the current page, with the attribute role="row"
  .withText('foobar') // will filter only those that contain the text 'foobar'
  .find('td') // from previous result(s), find all embedded <td> elements
  .nth(2); // take only the second cell

await pwc.expectThat(selector).hasText('foobar-2');
```

This API is still a draft and is in early development, but stay tuned!

## Contributing

Check out our [contributing guide](./CONTRIBUTING.md).

## Resources

- [Controller API documentation](/docs/controller.api.md)
- [Selector API documentation](/docs/selector.api.md)

## FAQ

### Q: How does playwright-controller relate to [Playwright](https://github.com/microsoft/playwright)?

Playwright-controller is just a wrapper around the Playwright API. The purpose of Playwright-controller is to be able to write e2e tests as fast as possible in a way that makes tests readable and maintainable.

### Q: Can I start using Playwright-controller in my existing code base?

Yes you can.

```js
import { PlaywrightController } from 'playwright-controller';

// just create a new instance with playwright's browser and page instances
const pwc = new PlaywrightController(browser, page);

// now you can use the fluent API
```

### Q: Can I use Playwright together with the Playwright-controller?

Yes you can. To use the Playwright API, just use the `currentBrowser()` and/or `currentPage()` methods exposed by the fluent API:

```js
const browser = 'chromium';
const pwc = new PlaywrightController();
await pwc
  .withBrowser(browser)
  .emulateDevice('iPhone 6 landscape')
  .withCursor()
  .navigateTo('https://reactstrap.github.io/components/form/')
  ...;

// now if you want to use the playwright API from this point:
const browser = pwc.currentBrowser();
const page = pwc.currentPage();

// the browser and page objects are standard playwright objects
// so now you are ready to go by using the playwright API
```

### Q: What can I do with the currently published npm package playwright-controller?

The documentations:

- [Controller API documentation](/docs/controller.api.md)
- [Selector API documentation](/docs/selector.api.md)

reflect the current status of the development and are inline with the published package.
