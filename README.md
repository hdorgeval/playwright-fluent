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

This API is still a draft and is in early development, but stay tuned!

## Contributing

Check out our [contributing guide](./CONTRIBUTING.md).

## Resources

- [Controller API documentation](/docs/controller.api.md)
