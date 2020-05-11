# Playwright Fluent API

- Chainable Methods

  - [withBrowser(browser)](#withBrowserbrowser)
  - [withOptions(options)](#withOptionsoptions)
  - [withCursor()](#withCursor)
  - [withGeolocation(location)](#withGeolocationlocation)
  - [withPermissions(permissions)](#withPermissionspermissions)
  - [emulateDevice(deviceName)](#emulateDevicedeviceName)
  - [recordFailedRequests()](#recordFailedRequests)
  - [recordPageErrors()](#recordPageErrors)
  - [recordRequestsTo(url)](#recordRequestsTourl)
  - [onRequestTo(url).respondWith(response)](#onRequestTourlrespondWithresponse)
  - [navigateTo(url[, options])](#navigateTourl-options)
  - [check(selector[, options])](#checkselector-options)
  - [uncheck(selector[, options])](#uncheckselector-options)
  - [click(selector[, options])](#clickselector-options)
  - [hover(selector[, options])](#hoverselector-options)
  - [pressKey(key[, options])](#pressKeykey-options)
  - [holdDownKey(key)](#holdDownKeykey)
  - [releaseKey(key)](#releaseKeykey)
  - [select(labels).in(selector[, options])](#selectlabelsinselector-options)
  - [select(labels).inFocused([options])](#selectlabelsinfocusedoptions)
  - [typeText(text[, options])](#typeTexttext-options)
  - [pasteText(text[, options])](#pasteTexttext-options)
  - [clearText([options])](#clearTextoptions)
  - [runStory(story)](#runStorystory)
  - [wait(duration)](#waitduration)
  - [waitUntil(predicate[, waitOptions])](#waitUntilpredicate-waitOptions)
  - [waitForStabilityOf(func[, waitOptions])](#waitForStabilityOffunc-waitOptions)
  - [close()](#close)
  - [see also all chainable methods exposed by the Assertion API](./assertion.api.md)

- Helper Methods

  - [cast(unknown)](#castunknown)
  - [clearPageErrors()](#clearPageErrors)
  - [currentBrowser()](#currentBrowser)
  - [currentPage()](#currentPage)
  - [getAllOptionsOf(selector[, options])](#getAllOptionsOfselector-options)
  - [getCurrentUrl()](#getCurrentUrl)
  - [getCurrentWindowState()](#getCurrentWindowState)
  - [getPageErrors()](#getPageErrors)
  - [getValueOf(selector[, options])](#getValueOfselector-options)
  - [hasFocus(selector[, options])](#hasFocusselector-options)
  - [isChecked(selector[, options])](#isCheckedselector-options)
  - [isUnchecked(selector[, options])](#isUncheckedselector-options)
  - [isDisabled(selector[, options])](#isDisabledselector-options)
  - [isEnabled(selector[, options])](#isEnabledselector-options)
  - [isVisible(selector[, options])](#isVisibleselector-options)
  - [takeFullPageScreenshotAsBase64([options])](#takeFullPageScreenshotAsBase64options)

## Chainable Methods

### withBrowser(browser)

- browser : `BrowserName`

```js
BrowserName = 'chrome' | 'chromium' | 'firefox' | 'webkit';
```

Will launch a browser together with a new page by using all `playwright` default settings and options.

If you choose 'chrome' you must have an already installed Chrome.
BEWARE: Playwright is only guaranteed to work with the bundled Chromium, Firefox or WebKit, use at your own risk.

Example:

```js
const browser = 'chromium';
const p = new PlaywrightFluent();
await p.withBrowser(browser);

// now if you want to use the playwright API from this point:
const browser = p.currentBrowser();
const page = p.currentPage();

// the browser and page objects are standard playwright objects
// so now you are ready to go by using the playwright API
```

---

### withOptions(options)

- options : `LaunchOptions`

```js
interface LaunchOptions {
  /**
   * Whether to run browser in headless mode.
   * Defaults to true
   *
   * @type {boolean}
   * @memberof LaunchOptions
   */
  headless: boolean;

  /**
   * Additional arguments to pass to the browser instance.
   * The list of Chromium flags can be found at
   * https://peter.sh/experiments/chromium-command-line-switches/
   *
   * @type {string[]}
   * @memberof LaunchOptions
   */
  args?: string[];

  /**
   * Path to a browser executable to run instead of the bundled one.
   *
   * @type {string}
   * @memberof LaunchOptions
   */
  executablePath?: string;
}
```

Will set browser options to apply when launching the browser.

Example:

```js
const browser = 'chromium';
const p = new PlaywrightFluent();

// start the browser in headfull mode
await p.withBrowser(browser).withOptions({ headless: false });
```

---

### withCursor()

Will show the mouse position with a non intrusive cursor.

Example:

```js
const browser = 'chromium';
const url = 'https://reactstrap.github.io/components/form';
const p = new PlaywrightFluent();

await p.withBrowser(browser).withOptions({ headless: false }).withCursor().navigateTo(url);
```

![demo cursor](../images/demo-cursor.gif)

---

### withPermissions(permissions)

- permissions: `...Permission[]`

Will set permissions.

```js
type Permission =
  | '*'
  | 'geolocation'
  | 'midi'
  | 'midi-sysex'
  | 'notifications'
  | 'push'
  | 'camera'
  | 'microphone'
  | 'background-sync'
  | 'ambient-light-sensor'
  | 'accelerometer'
  | 'gyroscope'
  | 'magnetometer'
  | 'accessibility-events'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'payment-handler';
```

Example:

```js
const browser = 'chromium';
const p = new PlaywrightFluent();

await p
  .withBrowser(browser)
  .withOptions({ headless: false })
  .withGeolocation({ longitude: 12.492507, latitude: 41.889938 })
  .withPermissions('geolocation')
  .navigateTo('https://www.openstreetmap.org/')
  .click('.control-locate');
```

---

### withGeolocation(location)

- location: `GeoLocation`

Will set Geo Location to the specified `location` data.

```js
interface Geolocation {
  longitude: number;
  latitude: number;
  accuracy?: number;
}
```

Example:

```js
const browser = 'chromium';
const p = new PlaywrightFluent();

await p
  .withBrowser(browser)
  .withOptions({ headless: false })
  .withGeolocation({ longitude: 12.492507, latitude: 41.889938 })
  .withPermissions('geolocation')
  .navigateTo('https://www.openstreetmap.org/')
  .click('.control-locate');
```

---

### emulateDevice(deviceName)

- deviceName: `DeviceName`
  - see the [list of supported devices](/src/devices/device-names.ts)

Will emulate the selected device, and the browser window size and viewport will match the selected device.

Example:

```js
const browser = 'chromium';
const url = 'https://reactstrap.github.io/components/form';
const p = new PlaywrightFluent();

// start the browser in headfull mode
// and emulate an iPhone 6 in landscape mode
await p
  .withBrowser(browser)
  .withOptions({ headless: false })
  .emulateDevice('iPhone 6 landscape')
  .navigateTo(url);
```

---

### recordPageErrors()

Will track and record page errors (uncaught exceptions).

- use `getPageErrors()` helper method on the fluent API to access errors that have occurred.
- use `clearPageErrors()` helper method on the fluent API to clear all past errors.

Example:

```js
const browser = 'chromium';
const url = 'https://reactstrap.github.io/components/form';
const p = new PlaywrightFluent();

// start the browser in headfull mode
// and emulate an iPhone 6 in landscape mode
await p
  .withBrowser(browser)
  .withOptions({ headless: false })
  .emulateDevice('iPhone 6 landscape')
  .recordPageErrors()
  .navigateTo(url)
  ...;

```

---

### recordFailedRequests()

Will track and record failed requests.

- use `getFailedRequests()` helper method on the fluent API to access errors that have occurred.
- use `clearFailedRequests()` helper method on the fluent API to clear all past errors.

Example:

```js
const browser = 'chromium';
const url = 'https://reactstrap.github.io/components/form';
const p = new PlaywrightFluent();

// start the browser in headfull mode
// and emulate an iPhone 6 in landscape mode
await p
  .withBrowser(browser)
  .withOptions({ headless: false })
  .emulateDevice('iPhone 6 landscape')
  .recordFailedRequests()
  .navigateTo(url);
```

The `playwright-fluent` package exposes the helper functions `stringifyRequest(request)` and `toRequestInfo(request)` that you can use to convert the `playwright` request object to a JSON object (see the example below).

```js
import { stringifyRequest } from 'playwright-fluent';

const failedRequests = p.getFailedRequests();
for (let index = 0; index < failedRequests.length; index++) {
  const failedRequest = failedRequests[index];
  const stringifiedRequest = await stringifyRequest(failedRequest);
  console.log(stringifiedRequest);
}
```

---

### recordRequestsTo(url)

- url: `string`

Will track and record requests whose url contains the input url. This parameter should be seen as a partial url (it is not a regex and not a glob pattern).

Usefull when you need to check what the front sends to the back and/or what the back sends to the front. Each recorded request is a standard `playwright` request object that contains both the request and the response.

The `playwright-fluent` package exposes the helper functions `stringifyRequest(request)` and `toRequestInfo(request)` that you can use to convert the `playwright` request object to a JSON object (see the example below).

Example:

```js
const browser = 'chromium';
const url = 'https://reactstrap.github.io/components/form';
const p = new PlaywrightFluent();

// start the browser in headfull mode
// and emulate an iPhone 6 in landscape mode
await p
  .withBrowser(browser)
  .withOptions({ headless: false })
  .emulateDevice('iPhone 6 landscape')
  .recordRequestsTo('/foo') // will record any requests whose url includes '/foo'
  .recordRequestsTo('/bar') // will also record any requests whose url includes '/bar'
  .navigateTo(url);
```

- use `getRecordedRequestsTo(url)` helper method on the fluent API to access all requests that have occurred with this `url`.

- use `getLastRecordedRequestTo(url)` helper method on the fluent API to access the last request that has occurred with this `url`.

- use `clearRecordedRequestsTo(url)` helper method on the fluent API to clear all past requests with this `url`.

- use `stringifyRequest(request)` method exposed by the package to either log the recorded requests

  ```js
  console.log(await stringifyRequest(request));
  ```

- use `toRequestInfo(request)` method exposed by the package to convert the recorded request to a POJO object:

  ```js
  const requestInfo = await toRequestInfo(request);
  ```

---

### onRequestTo(url).respondWith(response)

- url: `string`
- response: `Partial<MockResponse<T>`

Will intercept any request whose url contains the input `url` (this parameter should be seen as a partial url, it is not a regex and not a glob pattern), then will respond with the given `response` object.

The main purpose of this feature, is to be able to intercept rest API calls, that gives back a JSON object of type `T`, and then substitute the response by another JSON object of type `T`, or subsitute the HTTP response status by another one (for example subsitute an HTTP 200 by an HTTP 500, for chaos testing).

```js
interface MockResponse<T> {
  status: number;
  headers: Headers;
  contentType: string;
  body: T;
}
```

Example:

```js
const browser = 'chromium';
const url = 'https://reactstrap.github.io/components/form';
const p = new PlaywrightFluent();

const mockResponseBody {
  prop1: 'mocked-prop1',
  prop2: 'mocked-prop2'
};
const responseHeaders = {'foo-header': 'bar' };

// start the browser in headfull mode
// and emulate an iPhone 6 in landscape mode
await p
  .withBrowser(browser)
  .withOptions({ headless: false })
  .emulateDevice('iPhone 6 landscape')
  .onRequestTo('/foobar')
  .respondWith({
    status: 200,
    headers: responseHeaders,
    body: mockResponseBody,
  })
  .navigateTo(url);

```

---

### navigateTo(url[, options])

- url: `string`
- options: `NavigationOptions`

```js
interface NavigationOptions {
  /**
   * Maximum navigation time in milliseconds,
   * defaults to 30 seconds,
   * pass 0 to disable timeout
   *
   * @type {number}
   * @memberof NavigationOptions
   */
  timeout: number;
}
```

Will navigate to the specified url.

Example:

```js
const browser = 'chromium';
const url = 'https://reactstrap.github.io/components/form';
const p = new PlaywrightFluent();

// prettier-ignore
await p
  .withBrowser(browser)
  .navigateTo(url);

// now if you want to use the playwright API from this point:
const browser = p.currentBrowser();
const page = p.currentPage();

// the browser and page objects are standard playwright objects
// so now you are ready to go by using the playwright API
```

---

### hover(selector[, options])

- selector: `string | SelectorFluent`
- options: `Partial<HoverOptions>`

```js
interface HoverOptions {
  timeoutInMilliseconds: number;
  stabilityInMilliseconds: number;
  steps: number;
  verbose: boolean;
}
```

Will hover on the specified selector. The selector can be either a CSS selector or Selector Object created by the [Selector API](/docs/selector.api.md).

Example:

```js
const browser = 'chromium';
const url = 'https://reactstrap.github.io/components/form';
const selector = '#exampleCustomRange';
const p = new PlaywrightFluent();

await p
  .withBrowser(browser)
  .withOptions({ headless: false })
  .withCursor()
  .navigateTo(url)
  .hover(selector);

// now if you want to use the playwright API from this point:
const browser = p.currentBrowser();
const page = p.currentPage();

// the browser and page objects are standard playwright objects
// so now you are ready to go by using the playwright API
```

Example with a Selector Object:

```js
const browser = 'chromium';
const url = 'https://reactstrap.github.io/components/form';
const p = new PlaywrightFluent();
const selector = p.selector('label').withText('Email').nth(3);

await p
  .withBrowser(browser)
  .withOptions({ headless: false })
  .withCursor()
  .navigateTo(url)
  .hover(selector);

// now if you want to use the playwright API from this point:
const browser = p.currentBrowser();
const page = p.currentPage();

// the browser and page objects are standard playwright objects
// so now you are ready to go by using the playwright API
```

---

### check(selector[, options])

- selector: `string | SelectorFluent`
- options: `Partial<CheckOptions>`

```js
interface CheckOptions {
  stabilityInMilliseconds: number;
  timeoutInMilliseconds: number;
  verbose: boolean;
}
```

Will check the specified selector. The selector can be either a CSS selector or Selector Object created by the [Selector API](/docs/selector.api.md).

This method automatically waits for the selector to be visible, then hovers over it, then waits until it is enabled and finally check it, if not already checked.

Example:

```js
const url = 'https://reactstrap.github.io/components/form';
const checkMeOut = p.selector('label').withText('Check me out').find('input');

// When
await p
  .withBrowser('chromium')
  .withOptions({ headless: false })
  .withCursor()
  .emulateDevice('iPhone 6 landscape')
  .navigateTo(url)
  .check(checkMeOut)
  .expectThatSelector(checkMeOut)
  .isChecked();

// now if you want to use the playwright API from this point:
const browser = p.currentBrowser();
const page = p.currentPage();

// the browser and page objects are standard playwright objects
// so now you are ready to go by using the playwright API
```

---

### uncheck(selector[, options])

- selector: `string | SelectorFluent`
- options: `Partial<CheckOptions>`

```js
interface CheckOptions {
  stabilityInMilliseconds: number;
  timeoutInMilliseconds: number;
  verbose: boolean;
}
```

Will uncheck the specified selector. The selector can be either a CSS selector or Selector Object created by the [Selector API](/docs/selector.api.md).

This method automatically waits for the selector to be visible, then hovers over it, then waits until it is enabled and finally uncheck it, if not already unchecked.

Example:

```js
const url = 'https://reactstrap.github.io/components/form';
const checkMeOut = p.selector('label').withText('Check me out').find('input');

// When
await p
  .withBrowser('chromium')
  .withOptions({ headless: false })
  .withCursor()
  .emulateDevice('iPhone 6 landscape')
  .navigateTo(url)
  .uncheck(checkMeOut);

// now if you want to use the playwright API from this point:
const browser = p.currentBrowser();
const page = p.currentPage();

// the browser and page objects are standard playwright objects
// so now you are ready to go by using the playwright API
```

---

### click(selector[, options])

- selector: `string | SelectorFluent`
- options: `Partial<ClickOptions>`

```js
interface ClickOptions {
  button: 'left' | 'right' | 'middle';
  clickCount: number;
  delay: number;
  modifiers?: Modifier[];
  relativePoint?: Point;
  stabilityInMilliseconds: number;
  timeoutInMilliseconds: number;
  verbose: boolean;
}

type Modifier = 'Alt' | 'Control' | 'Meta' | 'Shift';
type Point = {
  x: number,
  y: number,
};
```

Will click on the specified selector. The selector can be either a CSS selector or Selector Object created by the [Selector API](/docs/selector.api.md).

This method automatically waits for the selector to be visible, then hovers over it, then waits until it is enabled and finally click on it.

Example:

```js
const url = 'https://reactstrap.github.io/components/form';
const checkMeOut = p.selector('label').withText('Check me out');

await p
  .withBrowser('chromium')
  .withOptions({ headless: false })
  .withCursor()
  .emulateDevice('iPhone 6 landscape')
  .navigateTo(url)
  .click(checkMeOut)
  .expectThat(checkMeOut.find('input'))
  .hasFocus();

// now if you want to use the playwright API from this point:
const browser = p.currentBrowser();
const page = p.currentPage();

// the browser and page objects are standard playwright objects
// so now you are ready to go by using the playwright API
```

![click demo](../images/demo-click.gif)

---

### pressKey(key[, options])

- key: `'Tab' | 'Backspace' | 'Enter' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'KeyA' ... 'KeyZ'`
- options: `Partial<KeyboardPressOptions>`

```js
interface KeyboardPressOptions {
  /**
   * Time to wait between keydown and keyup in milliseconds.
   * Defaults to 50.
   *
   * @type {number}
   * @memberof KeyboardPressOptions
   */
  delay: number;
}
```

Will press the specified key.

---

### holdDownKey(key)

### releaseKey(key)

- key: `'Shift' | 'Control' | 'Alt'`

Will hold down and release the specified key.

Example:

```js
await p
  .click(selector)
  .holdDownKey('Shift')
  .pressKey('KeyA')
  .pressKey('KeyB')
  .releaseKey('Shift')
  .pressKey('KeyA');

// will generate ABa
```

---

### select(labels).in(selector[, options])

- labels : `...string[]`
- selector: `string | SelectorFluent`
- options: `Partial<SelectOptions>`

```js
interface SelectOptions {
  stabilityInMilliseconds: number;
  timeoutInMilliseconds: number;
  verbose: boolean;
}
```

Will select label(s) in the specified selector.

```html
<select id="select">
  <option value="value 1" selected>label 1</option>
  <option value="value 2">label 2</option>
  <option value="value 3">label 3</option>
</select>
```

```js
const selector = '#select';
await p.select('label 2').in(selector);
```

---

### select(labels).inFocused([options])

- labels : `...string[]`
- options: `Partial<SelectOptions>`

```js
interface SelectOptions {
  stabilityInMilliseconds: number;
  timeoutInMilliseconds: number;
  verbose: boolean;
}
```

Will select label(s) in the select element that has current focus.

```html
<label for="select">Select something</label>
<select id="select">
  <option value="value 1" selected>label 1</option>
  <option value="value 2">label 2</option>
  <option value="value 3">label 3</option>
</select>
```

```js
// prettier-ignore
await p
  .click(p.selector('label').withText('Select something'))
  .select('label 2').inFocused();
```

---

### typeText(text[, options])

- text: `string`
- options: `Partial<TypeTextOptions>`

```js
interface TypeTextOptions {
  /**
   * Time to wait between key presses in milliseconds.
   * Defaults to 50
   *
   * @type {number}
   * @memberof TypeTextOptions
   */
  delay: number;
}
```

Will type text in the element that has current focus. This method will automtically empty any existing content before typing the specified text.

---

### pasteText(text[, options])

- text: `string`
- options: `Partial<PasteTextOptions>`

```js
interface PasteTextOptions {
  /**
   * Time to wait between key presses in milliseconds.
   * Defaults to 50
   *
   * @type {number}
   * @memberof TypeTextOptions
   */
  delay: number;

  /**
   * Should be set to true when the underlying selector does not explicitely handle the paste event.
   * When sets to true, playwright-fluent automatically attaches a paste event handler on the focused selector.
   * Defaults to false.
   *
   * @type {boolean}
   * @memberof PasteTextOptions
   */
  handlePasteEvent: boolean;
}
```

Will paste text in the element that has current focus. This method will automtically empty any existing content before pasting the specified text.

---

### clearText([options])

- options: `Partial<ClearTextOptions>`

```js
interface ClearTextOptions {
  /**
   * Time to wait between key presses in milliseconds.
   * Defaults to 50
   *
   * @type {number}
   * @memberof ClearTextOptions
   */
  delay: number;
}
```

Will clear text in the element that has current focus.

example:

```js
await p
  .withBrowser('chromium')
  .withOptions({ headless: false })
  .withCursor()
  .navigateTo(url)
  .click(selector)
  .clearText();
```

---

### wait(duration)

- duration: `number`

  time to wait in milliseconds.

---

### waitUntil(predicate[, waitOptions])

- predicate: `() => Promise<boolean>`
- waitOptions: `Partial<WaitUntilOptions>`

Will wait until predicate becomes true.
If the predicate does not return true during the specified period, an error will be throwed.
To prevent throwing, set `throwOnTimeout: false` in the `waitOptions`.

Usage example:

```js
const selector = p
  .selector('[role="row"]')
  .find('td')
  .find('p');
  .withText('foobar');

await p.waitUntil(() => selector.isVisible());
```

---

### waitForStabilityOf(func[, waitOptions])

- func: `() => Promise<string | boolean | number | null | undefined>`
- waitOptions: `Partial<WaitUntilOptions>`

Waits until the function `func()` returns the same result during a specified period of time that defaults to 300 ms.

If the function `func()` does not return the same result during the specified period, an error will be throwed.
To prevent throwing, set `throwOnTimeout: false` in the `waitOptions`.

Usage example:

```js
const selector = p.selector('[role="row"]'); // will select all rows in a grid

await p.waitForStabilityOf(() => selector.count()); // waits until the number of rows is stable
```

---

### runStory(story)

- story: `Story | StoryWithProps<T>`

```js
type Story = (p: PlaywrightFluent) => Promise<void>;
type StoryWithProps<T> = (p: PlaywrightFluent, props: T) => Promise<void>;
```

A `Story` is an async method you write that will receive, at runtime, the current instance of the `PlaywrightFluent`.

A `StoryWithProps<T>` is an async method you write, that will receive, at runtime, the current instance of the `PlaywrightFluent`, and a parameter of type `T` supplied by you in the `runStory` method.

Example:

```js
import { PlaywrightFluent } from 'playwright-fluent';
import { startApp } from '../stories/start-app';
import { selectLabel } from '../stories/select-label';

const url = `some valid url`;
const p = new PlaywrightFluent();

await p
  .runStory(startApp, { browser: 'chromium', isHeadless: false, url })
  .runStory(selectLabel, 'label 2');
```

../stories/start-app.js

```js
import { StoryWithProps } from 'playwright-fluent';

export interface StartAppProps {
  browser: BrowserName;
  isHeadless: boolean;
  url: string;
}

export const startApp: StoryWithProps<StartAppProps> = async (p, props) => {
  await p
    .withBrowser(props.browser)
    .withOptions({ headless: props.isHeadless })
    .withCursor()
    .navigateTo(props.url);
};
```

../stories/select-label.js

```js
import { StoryWithProps } from 'playwright-fluent';

export const selectLabel: StoryWithProps<string> = async (p, label) => {
  const selector = 'some valid css selector';
  await p.select(label).in(selector);
};
```

As shown in the above example, the goal of a `story` is to write a test as a composition of functional components (like in React).

**Warning**: the internal implementation of the `runStory` only handle simple use cases.

If you call `runStory` inside another `runStory` inside another `runStory` it might not work.

Two levels of imbrication should work, but three levels might not.

As a simple rule, if you observe that a story is not executed or is executed too late, you should break the chained `runStory` like this:

```js
// prettier-ignore
await p
  .runStory(storyA)
  .runStory(storyB);

// simply break the chained calls to make things work:
await p.runStory(storyA);
await p.runStory(storyB);
```

Example of code that do not work:

```js
const p = new PlaywrightFluent();
await p.runStory(mainStory);

const mainStory: Story = async (p) => {
  // prettier-ignore
  await p
    .runStory(storyA)
    .runStory(storyB);
};

const storyA: Story = async (p) => {
  // prettier-ignore
  await p
    .runStory(storyA1)
    .runStory(storyA2);
};

const storyB: Story = async (p) => {
  // prettier-ignore
  await p
    .runStory(storyB1)
    .runStory(storyB2);
};
```

In the above example `StoryB` will execute before `StoryA`.

To make things work:

```js
const mainStory: Story = async (p) => {
  // prettier-ignore
  await p
    .runStory(storyA)
    .runStory(storyB);
};
```

Should be rewritten to:

```js
const mainStory: Story = async (p) => {
  await p.runStory(storyA);
  await p.runStory(storyB);
};
```

---

### close()

Will close the browser. This should be the last method called in the chain.

---

## Helper Methods

### getCurrentUrl()

- returns: `Promise<string>`

Get the current url opened by the current page.

---

### getCurrentWindowState()

- returns: `Promise<WindowState>`

Get infos about the browser's window dimensions.

```js
interface WindowState {
  /**
   * Interior height of the browser window in pixels,
   * including the height of the horizontal scroll bar, if present.
   *
   * @type {number}
   * @memberof WindowState
   */
  innerHeight: number;

  /**
   * Interior width of the browser window in pixels.
   * This includes the width of the vertical scroll bar,
   * if one is present.
   *
   * @type {number}
   * @memberof WindowState
   */
  innerWidth: number;
  /**
   * Tells if the browser window is very near to the screen size
   *
   * @type {boolean}
   * @memberof WindowState
   */
  isMaximized: boolean;

  /**
   * Width of the whole browser window,
   * including sidebar (if expanded),
   * window chrome and window resizing borders/handles
   *
   * @type {number}
   * @memberof WindowState
   */
  outerHeight: number;

  /**
   *
   *
   * @type {number}
   * @memberof WindowState
   */
  outerWidth: number;
  screen: {
    availWidth: number,
    availHeight: number,
  };
}
```

---

### getPageErrors()

Get page errors (uncaught exceptions) that occurred while executing the test.

```js
await p
.withBrowser('chromium')
.withOptions({ headless: false })
.withCursor()
.emulateDevice('iPhone 6 landscape')
.recordPageErrors()
.navigateTo(url)
...

const errors: Error[] = p.getPageErrors();
// analyse errors by iterating on the returned array
// an empty array means that no error has occurred or that you forgot to call the recordPageErrors() method
```

---

### cast(unknown)

- cast input object as a `PlaywrightFluent` instance; usefull when a `PlaywrightFluent` instance is stored in an untyped context like in cucumberJS.

```js
import { cast } from 'playwright-fluent';

// this.context.p has type unknown when the context object is untyped
const p = cast(this.context.p);

// now you have full intellisense on the `p` instance
// ...
```

---

### clearPageErrors()

Clear page errors that occurred. Usefull if you want to track page errors only after a specific context has been setup on the page.

---

### getValueOf(selector[, options])

- selector: `string`
- options: `Partial<WaitUntilOptions>`
- returns: `Promise<string | undefined | null>`

Get selector's value.

> The Fluent API waits until the selector appears in the DOM. This waiting mechanism can be customized through the `options` parameter.

```js
interface WaitUntilOptions {
  /**
   * Defaults to 30000 milliseconds.
   *
   * @type {number}
   * @memberof WaitUntilOptions
   */
  timeoutInMilliseconds: number;
  /**
   * Time during which the callback must always return true.
   * Defaults to 300 milliseconds.
   * You must not setup a duration < 100 milliseconds.
   * @type {number}
   * @memberof AssertOptions
   */
  stabilityInMilliseconds: number;
  /**
   * Throw a timeout exception when the callback still returns false.
   * Defaults to true.
   * @type {boolean}
   * @memberof WaitUntilOptions
   */
  throwOnTimeout: boolean;
  /**
   * Output to the console all steps of the waiting mechanism.
   * Defaults to false.
   * Use this option when the waitUntil() method does not wait as expected.
   *
   * @type {boolean}
   * @memberof WaitUntilOptions
   */
  verbose: boolean;
}
```

---

### getAllOptionsOf(selector[, options])

- selector: `string`
- options: `Partial<WaitUntilOptions>`
- returns: `Promise<SelectOptionInfo[]>`

Get selector's options list. Only apply when selector is a `select` element.

> The Fluent API waits until the selector appears in the DOM. This waiting mechanism can be customized through the `options` parameter.

```js
interface SelectOptionInfo {
  value: string;
  label: string;
  selected: boolean;
}
```

```js
interface WaitUntilOptions {
  /**
   * Defaults to 30000 milliseconds.
   *
   * @type {number}
   * @memberof WaitUntilOptions
   */
  timeoutInMilliseconds: number;
  /**
   * Time during which the callback must always return true.
   * Defaults to 300 milliseconds.
   * You must not setup a duration < 100 milliseconds.
   * @type {number}
   * @memberof AssertOptions
   */
  stabilityInMilliseconds: number;
  /**
   * Throw a timeout exception when the callback still returns false.
   * Defaults to true.
   * @type {boolean}
   * @memberof WaitUntilOptions
   */
  throwOnTimeout: boolean;
  /**
   * Output to the console all steps of the waiting mechanism.
   * Defaults to false.
   * Use this option when the waitUntil() method does not wait as expected.
   *
   * @type {boolean}
   * @memberof WaitUntilOptions
   */
  verbose: boolean;
}
```

---

### hasFocus(selector[, options])

- selector: `string | SelectorFluent`
- options: `Partial<WaitUntilOptions>`
- returns: `Promise<boolean>`

Checks if selector has the focus.

> The Fluent API waits until the selector appears in the DOM. This waiting mechanism can be customized through the `options` parameter.

---

### isChecked(selector[, options])

- selector: `string | SelectorFluent`
- options: `Partial<WaitUntilOptions>`
- returns: `Promise<boolean>`

Checks if selector is checked.

> The Fluent API waits until the selector appears in the DOM. This waiting mechanism can be customized through the `options` parameter.

---

### isUnchecked(selector[, options])

- selector: `string | SelectorFluent`
- options: `Partial<WaitUntilOptions>`
- returns: `Promise<boolean>`

Checks if selector is unchecked.

> The Fluent API waits until the selector appears in the DOM. This waiting mechanism can be customized through the `options` parameter.

---

### isDisabled(selector[, options])

- selector: `string | SelectorFluent`
- options: `Partial<WaitUntilOptions>`
- returns: `Promise<boolean>`

Checks if selector is disabled.

> The Fluent API waits until the selector appears in the DOM. This waiting mechanism can be customized through the `options` parameter.

---

### isEnabled(selector[, options])

- selector: `string | SelectorFluent`
- options: `Partial<WaitUntilOptions>`
- returns: `Promise<boolean>`

Checks if selector is enabled.

> The Fluent API waits until the selector appears in the DOM. This waiting mechanism can be customized through the `options` parameter.

---

### isVisible(selector[, options])

- selector: `string | SelectorFluent`
- options: `Partial<WaitUntilOptions>`
- returns: `Promise<boolean>`

Checks if selector is visible.

> The Fluent API waits until the selector appears in the DOM. This waiting mechanism can be customized through the `options` parameter.

---

### takeFullPageScreenshotAsBase64([options])

- options: `Partial<ScreenshotOptions>`
- returns: `Promise<string>`

Will take a full page screenshot.

```js
interface ScreenshotOptions {
  fullPage: boolean;
  /**
   * Hides default white background and allows capturing screenshots with transparency.
   * Not applicable to jpeg images.
   * Defaults to false.
   *
   * @type {boolean}
   * @memberof ScreenshotOptions
   */
  omitBackground: boolean;
}
```

```js
const screenshot = await p.takeFullPageScreenshotAsBase64();
```

---

### currentPage()

- returns: `Page | undefined`

Get Playwright's page instance of The Fluent API in order to do stuff not covered by this API.

Example:

```js
const p = new PlaywrightFluent();

// use the Fluent API
// ...

const page = p.currentPage();

// now use this page instance through the playwright API
```

---

### currentBrowser()

- returns: `Browser | undefined`

Get Playwright's browser instance of The Fluent API in order to do stuff not covered by this API.

Example:

```js
const p = new PlaywrightFluent();

// use the Fluent API
// ...

const browser = p.currentBrowser();

// now use this browser instance through the playwright API
```

---
