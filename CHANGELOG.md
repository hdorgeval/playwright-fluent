# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html)

## [0.9.0] - 2020-02-26

### Added

- feat(assertion): add `expectThat(selector).isDisabled()` to the Assertion API
- feat(assertion): add `expectThat(selector).isEnabled()` to the Assertion API
- feat(controller): add `isEnabled(selector[, options])` to the Controller API
- feat(controller): add `isDisabled(selector[, options])` to the Controller API

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
