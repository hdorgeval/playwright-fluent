# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html)

## [1.6.0] - 2020-10-10

### Added

- feat(fluent-api): add `doubleClick(selector)` to the Fluent API
- feat(fluent-api): add helper method `getSelectedText()` to the Fluent API

## [1.5.0] - 2020-10-04

### Added

- feat(selector-fluent): add `nextSibling()` to the Selector API

## [1.4.0] - 2020-06-21

### Added

- feat(selector-fluent): add `withPlaceholder(text)` to the Selector API

## [1.3.0] - 2020-06-01

### Breaking change

- `playwright` is made a peer dependency with version >= 0.14.0

### Added

- feat(assertion): add `expectThatSelector(selector).hasPlaceholder(text)` to the Assertion API
- feat(selector-fluent): add helper method `getAttribute(attributeName)` to the Selector API
- feat(selector-fluent): add helper method `placeholder()` to the Selector API

## [1.2.0] - 2020-05-26

### Added

- feat(fluent-api): add `withExtraHttpHeaders(headers)` to the Fluent API

### Changed

- feat(browser-actions): default browser close timeout to 3000 milliseconds

## [1.1.0] - 2020-05-23

### Added

- feat(selector-fluent): add helper method `hasClass(class)` to the Selector API
- feat(selector-fluent): add helper method `doesNotHaveClass(class)` to the Selector API
- feat(assertion): add `expectThatSelector(selector).doesNotHaveClass(className)` to the Assertion API

### Fixed

- feat(browser): add timeout option on closing the browser. This mechanism prevents a test to fail if closing the browser does not work as expected. It has been added to prevent a use case observed on windows where calling `close()` on the browser does close the browser but execution of this method never finishes, causing a timeout in `jest` or `cucumber`.

## [1.0.0] - 2020-05-20

### Breaking change

- `playwright` is made a peer dependency with version >= 0.13.0

## [0.31.0] - 2020-05-17

### Added

- feat(fluent-api): add `withWindowSize(size)` to the Fluent API
- feat(fluent-api): add `withViewport(viewport)` to the Fluent API

## [0.30.0] - 2020-05-11

### Added

- feat(utils): add toQueryString(url) utility method
- feat(utils): add toRequestInfo() utility method

## [0.29.0] - 2020-05-10

### Added

- feat(fluent-api): add `uncheck(selector)` to the Fluent API
- feat(selector): add helper method `isUnchecked()` to the Selector API
- feat(fluent-api): add helper method `isUnchecked()` to the Fluent API
- feat(assertion): add `expectThat(selector).isUnchecked()` to the Assertion API

## [0.28.0] - 2020-05-08

### Added

- feat(fluent-api): add `check(selector)` to the Fluent API

## [0.27.0] - 2020-05-07

### Added

- feat(fluent-api): add `withGeolocation(location)` to the Fluent API
- feat(fluent-api): add `withPermissions(permissionA, permissionB, ...)` to the Fluent API

## [0.26.0] - 2020-05-06

### Added

- feat(fluent-api): add `onRequestTo(url).respondWith(response)` to the Fluent API

## [0.25.0] - 2020-05-05

### Added

- feat(fluent-api): add `select(labels).inFocused()` to the Fluent API

### Breaking Change

- option `throwOnTimeout` in `WaitUntilOptions` now always defaults to true

## [0.24.2] - 2020-05-02

### Fixed

- fix(utils): HTML encode not-a-json payload in method `stringifyRequest()`

## [0.24.1] - 2020-04-29

### Fixed

- fix(handle-actions): disable smooth scrolling
  > the scrollIntoView method becomes unresponsive after a few scrolling when the smooth option is enabled. Therefore this option has been removed until fixed.

## [0.24.0] - 2020-04-19

### Added

- feat(selector): add helper method `options()` to the Selector API
- feat(fluent-api): add helper method `getAllOptionsOf(selector)` to the Fluent API

## [0.23.0] - 2020-04-14

### Added

- feat(assertion): add `expectThatSelector(selector).isChecked()` to the Assertion API
- feat(selector): add helper method `isChecked()` to the Selector API
- feat(fluent-api): add helper method `isChecked()` to the Fluent API

## [0.22.0] - 2020-04-10

### Added

- feat(assertion): add `expectThatSelector(selector).hasClass(className)` to the Assertion API
- feat(selector): add helper method `classList()` to the Selector API

## [0.21.0] - 2020-03-23

### Added

- feat(assertion): add `expectThatSelector(selector).hasExactValue(value)` to the Assertion API

## [0.20.0] - 2020-03-21

### Added

- feat(fluent-api): add `holdDownKey(key)` and `releaseKey(key)` to the Fluent API

## [0.19.0] - 2020-03-21

### Added

- feat(fluent-api): add method `runStory(story)` to the Fluent API

## [0.18.0] - 2020-03-19

### Added

- feat(fluent-api): add `pasteText(text)` to the Fluent API

## [0.17.0] - 2020-03-17

### Added

- feat(fluent-api): add `clearText()` to the Fluent API

## [0.16.0] - 2020-03-15

### BREAKING CHANGE

- `expectThat` method is renamed to `expectThatSelector` on the Fluent API

Though a major version should have been published, and because this library has still little usage, I decided to postpone the major version until the Playwright team publishes a new major version.

### Added

- refactor(fluent-api): rename `expectThat` method to `expectThatSelector`
- feat(fluent-api): add `recordFailedRequests()` to the Fluent API
- feat(assertion): add `expectThatSelector(selector).hasValue(value)` to the Assertion API
- feat(assertion): add `expectThatAsyncFunc(func).resolvesTo(value)` to the Assertion API
- feat(selector): add helper method `value()` to the Selector API
- feat(fluent-api): add helper method `cast()` to the Fluent API

## [0.15.0] - 2020-03-10

### Added

- feat(fluent-api): add helper method `takeFullPageScreenshotAsBase64()` to the Fluent API

## [0.14.0] - 2020-03-08

### Added

- feat(assertion): add `expectThat(selector).hasText(text)` to the Assertion API
- feat(fluent-api): add `recordPageErrors()` to the Fluent API
- feat(fluent-api): add `select(option).in(selector)` to the Fluent API
- feat(fluent-api): add helper method `getInnerTextOf(selector)` to the Fluent API
- feat(fluent-api): add helper method `getPageErrors()` to the Fluent API
- feat(fluent-api): add helper method `clearPageErrors()` to the Fluent API
- feat(selector): add helper method `innerText()` to the Selector API

## [0.13.0] - 2020-03-05

### Added

- feat(fluent-api): add `waitForStabilityOf(func)` to the Fluent API
- feat(fluent-api): add `recordRequestsTo(url)` to the Fluent API
- feat(fluent-api): add helper method `getRecordedRequestsTo(url)` to the Selector API
- feat(fluent-api): add helper method `getLastRecordedRequestTo(url)` to the Selector API
- feat(fluent-api): add helper method `clearRecordedRequestsTo(url)` to the Selector API

## [0.12.0] - 2020-03-02

### BREAKING CHANGE

- PlaywrightController class is renamed to PlaywrightFluent
- SelectorController class is renamed to SelectorFluent

Though a major version should have been published, and because this library has still little usage, I decided to postpone the major version until the Playwright team publishes a new major version.

## [0.11.0] - 2020-03-02

### BREAKING CHANGE

- project and package are renamed to `playwright-fluent`

Though a major version should have been published, and because this library has still little usage, I decided to postpone the major version until the Playwright team publishes a new major version.

## [0.10.0] - 2020-03-01

### Added

- feat(controller): the method `withBrowser()` can now target chrome
- feat(controller): add `waitUntil(predicate)` to the Controller API
- feat(controller): add `pressKey(key)` method to the Controller API
- feat(controller): add `click(selector)` method to the Controller API
- feat(controller): add `typeText(text)` to the Controller API
- feat(selector): add helper method `.isVisible()` to the Selector API
- feat(selector): add helper method `.isNotVisible()` to the Selector API
- feat(assertion): add `expectThat(selector).isNotVisible()` to the Assertion API

## [0.9.1] - 2020-02-27

### Fixed

- fix(browser-actions): close browser contexts first before closing the browser and do not throw but just log a warning on error while closing the browser.

## [0.9.0] - 2020-02-26

### Added

- feat(assertion): add `expectThat(selector).isDisabled()` to the Assertion API
- feat(assertion): add `expectThat(selector).isEnabled()` to the Assertion API
- feat(controller): add `isEnabled(selector[, options])` to the Controller API
- feat(controller): add `isDisabled(selector[, options])` to the Controller API
- feat(controller): add `isVisible(selector[, options])` to the Controller API

## [0.8.0] - 2020-02-24

### Added

- feat(assertion): add `expectThat(selector).isVisible()` to the Assertion API

## [0.7.0] - 2020-02-23

### Added

- feat(assertion): add `expectThat(selector).hasFocus()` to the Assertion API
- feat(controller): introduce Assertion API `expectThat(selector)`
- feat(controller): add helper method `hasFocus(selector)` on controller API

## [0.6.0] - 2020-02-20

### Added

- feat(controller): be able to hover on a Selector object created by the Selector API
- feat(controller): add method wait(duration) in Controller API
- feat(selector): add helper method getHandle() in Selector API
- feat(selector): add helper method exists() in Selector API

### Fixed

- fix(controller): expose executablePath in LaunchOptions

## [0.5.0] - 2020-02-18

### Added

- feat(controller): introduce Selector API

## [0.4.0] - 2020-02-16

### Added

- feat(controller): add method hover(selector) on Controller API
- feat(controller): add helper method getValueOf(selector) on Controller API

## [0.3.0] - 2020-02-14

### Added

- feat(controller): add withCursor() to the Controller API

## [0.2.0] - 2020-02-12

### Added

- feat(controller): add emulateDevice() to the Controller API
- feat(controller): disable internal playwright default viewport of 800x600
- feat(controller): add withOptions() to the controller API
- feat(controller): add helper method getCurrentWindowState() to the controller API

## [0.1.0] - 2020-02-08

### Added

- implement minimalist fluent API around playwright
