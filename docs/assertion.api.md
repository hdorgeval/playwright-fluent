# Playwright Assertion API

The Assertion API enables to chain assertions on a selector and on async functions.

The selector can be either a CSS selector or a selector created with the [Selector API](./selector.api.md)

- Chainable Methods

  - [expectThatAsyncFunc(func).resolvesTo(value,[options])](#expectThatAsyncFuncfuncresolvesTovalueoptions)
  - [expectThatSelector(selector).doesNotHaveClass(className,[options])](#expectThatSelectorselectordoesNotHaveClassclassNameoptions)
  - [expectThatSelector(selector).exists([options])](#expectThatSelectorselectorexistsoptions)
  - [expectThatSelector(selector).hasAttributeWithValue(attributeName, attributeValue, [options])](#expectThatSelectorselectorhasAttributeWithValueattributeName-attributeValue-options)
  - [expectThatSelector(selector).hasClass(className,[options])](#expectThatSelectorselectorhasclassclassNameoptions)
  - [expectThatSelector(selector).hasExactValue(value,[options])](#expectThatSelectorselectorhasExactvaluevalueoptions)
  - [expectThatSelector(selector).hasFocus([options])](#expectThatSelectorselectorhasFocusoptions)
  - [expectThatSelector(selector).hasPlaceholder(text,[options])](#expectThatSelectorselectorhasplaceholdertextoptions)
  - [expectThatSelector(selector).hasText(text,[options])](#expectThatSelectorselectorhastexttextoptions)
  - [expectThatSelector(selector).hasValue(value,[options])](#expectThatSelectorselectorhasvaluevalueoptions)
  - [expectThatSelector(selector).isChecked([options])](#expectThatSelectorselectorisCheckedoptions)
  - [expectThatSelector(selector).isDisabled([options])](#expectThatSelectorselectorisDisabledoptions)
  - [expectThatSelector(selector).isEnabled([options])](#expectThatSelectorselectorisEnabledoptions)
  - [expectThatSelector(selector).isNotVisible([options])](#expectThatSelectorselectorisNotVisibleoptions)
  - [expectThatSelector(selector).isUnchecked([options])](#expectThatSelectorselectorisUncheckedoptions)
  - [expectThatSelector(selector).isVisible([options])](#expectThatSelectorselectorisVisibleoptions)

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
  .expectThatSelector('body')
  .hasFocus();

// you can also use the alias expectThat:
await p
  .withBrowser('chromium')
  .withCursor()
  .withOptions({ headless: false })
  .navigateTo(url)
  .expectThat('body')
  .hasFocus();
```

## Chainable Methods

### expectThatSelector(selector).hasFocus([options])

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

### expectThatSelector(selector).hasText(text,[options])

- selector: `string | SelectorFluent`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector's inner text contains the specified `text`.

---

### expectThatSelector(selector).hasClass(className,[options])

- selector: `string | SelectorFluent`
- className: `string`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector has a class named `className`.

---

### expectThatSelector(selector).hasPlaceholder(text,[options])

- selector: `string | SelectorFluent`
- text: `string`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector has a placeholder attribute with the specified `text`.

---

### expectThatSelector(selector).hasAttributeWithValue(attributeName, attributeValue, [options])

- selector: `string | SelectorFluent`
- attributeName: `string`
- attributeValue: `string`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector has an attribute with the specified value.

---

### expectThatSelector(selector).doesNotHaveClass(className,[options])

- selector: `string | SelectorFluent`
- className: `string`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check that the selector does not have class named `className`.

---

### expectThatSelector(selector).hasValue(value,[options])

- selector: `string | SelectorFluent`
- value: `string`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector's value contains the specified `value`.

---

### expectThatSelector(selector).hasExactValue(value,[options])

- selector: `string | SelectorFluent`
- value: `string`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector's value is equal to the specified `value`.

---

### expectThatAsyncFunc(func).resolvesTo(value,[options])

- func: `() => Promise<string | number | boolean | null | undefined>`
- value: `string | number | boolean | null | undefined`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the async function `func` resolves to the specified `value`.

Example:

```js
const rows = p.selector('[role="row"]');
await p
  .withBrowser('chromium')
  .withCursor()
  .withOptions({ headless: false })
  .navigateTo(url)
  .expectThatAsyncFunc(() => rows.count())
  .resolvesTo(1);
```

---

### expectThatSelector(selector).isVisible([options])

- selector: `string | SelectorFluent`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector is visible.

---

### expectThatSelector(selector).isNotVisible([options])

- selector: `string | SelectorFluent`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector is not visible.

---

### expectThatSelector(selector).exists([options])

- selector: `string | SelectorFluent`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector exists in DOM.

---

### expectThatSelector(selector).isChecked([options])

- selector: `string | SelectorFluent`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector is checked.

---

### expectThatSelector(selector).isUnchecked([options])

- selector: `string | SelectorFluent`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector is unchecked.

---

### expectThatSelector(selector).isEnabled([options])

- selector: `string | SelectorFluent`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector is enabled.

---

### expectThatSelector(selector).isDisabled([options])

- selector: `string | SelectorFluent`
- options: `Partial<AssertOptions>`
- returns: `PlaywrightFluent`

Will check if the selector is disabled.

---
