# Playwright Assertion API

The Assertion API enables to chain assertions on a selector. The selector can be either a CSS selector or a selector created with the [Selector API](./selector.api.md)

- Chainable Methods

  - [expectThat(selector).hasFocus([options])](#expectThatselectorhasFocusoptions)
  - [expectThat(selector).isDisabled([options])](#expectThatselectorisDisabledoptions)
  - [expectThat(selector).isEnabled([options])](#expectThatselectorisEnabledoptions)
  - [expectThat(selector).isVisible([options])](#expectThatselectorisVisibleoptions)
  - [expectThat(selector).isNotVisible([options])](#expectThatselectorisNotVisibleoptions)

## Usage

Assertion API are chainable methods that can be called on a `PlaywrightFluent` instance.

```js
import { PlaywrightFluent } from 'playwright-fluent';

const p = new PlaywrightFluent();

const url = 'https://reactstrap.github.io/components/form';
await p
  .withBrowser('chromium')
  .withCursor()
  .withOptions({ headless: false })
  .navigateTo(url)
  .expectThat('body')
  .hasFocus();
```

## Chainable Methods

### expectThat(selector).hasFocus([options])

- selector: `string | SelectorFluent`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector has the focus.

```js
interface AssertOptions {
  /**
   * Defaults to 30000 milliseconds.
   *
   * @type {number}
   * @memberof AssertOptions
   */
  timeoutInMilliseconds: number;

  /**
   * time during which the Assert must give back the same result.
   * Defaults to 300 milliseconds.
   * You must not setup a duration < 100 milliseconds.
   * @type {number}
   * @memberof AssertOptions
   */
  stabilityInMilliseconds: number;

  /**
   * Will generate 'debug' logs,
   * so that you can understand why the assertion does not give the expected result.
   * Defaults to false
   * @type {boolean}
   * @memberof AssertOptions
   */
  verbose: boolean;
}
```

---

### expectThat(selector).isVisible([options])

- selector: `string | SelectorFluent`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector is visible.

---

### expectThat(selector).isNotVisible([options])

- selector: `string | SelectorFluent`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector is not visible.

---

### expectThat(selector).isEnabled([options])

- selector: `string | SelectorFluent`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector is enabled.

---

### expectThat(selector).isDisabled([options])

- selector: `string | SelectorFluent`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector is disabled.

---
