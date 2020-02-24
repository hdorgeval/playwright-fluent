# Playwright Selector API

The Selector API enables to find and target a DOM element or a collection of DOM elements embedded in a complex DOM Hierarchy.

- Chainable Methods

  - [find(selector)](#findselector)
  - [nth(index)](#nthindex)
  - [parent()](#parent)
  - [withText(text)](#withTexttext)
  - [withValue(text)](#withValuetext)

- Helper Methods

  - [count()](#count)
  - [exists()](#exists)
  - [getAllHandles()](#getAllHandles)
  - [getFirstHandleOrNull()](#getFirstHandleOrNull)
  - [getHandle()](#getHandle)
  - [toString()](#toString)

## Usage

To use the Selector API, you must first get a selector object from the controller, then use the chainable methods to compose your query, and finally execute the query by calling `getHandle()` if your query targets only one element or by calling `getAllHandles()` if the query targets a collection of elements:

```js
import { PlaywrightController } from 'playwright-controller';

const pwc = new PuppeteerController();

// Given I open The AG Grid demo site
const url = 'https://www.ag-grid.com/example.php';
await pwc
  .withBrowser('chromium')
  .withCursor()
  .withOptions({ headless: false })
  .navigateTo(url);

// When I select Olivia Brenan's name
const agGridContainer = pwc.selector('div.ag-body-viewport');
const checkbox = agGridContainer
  .find('div[role="row"]')
  .withText('Olivia Brennan')
  .nth(1) // take the first row that contains 'Olivia Brennan'
  .find('div[col-id="name"]') // in this row, take the cell of the 'Name' column
  .find('span.ag-selection-checkbox'); // in this cell, take the checkbox

const handle = await checkbox.getHandle(); // get the Playwright's element handle
await handle.click();
```

## Chainable Methods

### find(selector)

- selector: `string`

Finds all `selector` elements starting from previous found elements.

---

### withText(text)

- text: `string`

Take, from previous search, only the elements whose innerText contains the specified text.

---

### withValue(text)

- text: `string`

Take, from previous search, only the elements whose value contains the specified text.

---

### nth(index)

- index: `number` (1-based index)

Take, from previous search, the nth element.

- To take the first element : `.nth(1)`
- To take the last element : `.nth(-1)`

---

### parent()

Take the direct parent of each elements found in the previous step.

---

## Helper Methods

### getAllHandles()

- returns: `Promise<ElementHandle<Element>[]>`

Executes the search. Will return an empty array if no elements are found, will return all found elements otherwise.

The result may differ from one execution to another especially if targeted element is rendered lately because its data is based on some backend response.

---

### getFirstHandleOrNull()

- returns: `Promise<ElementHandle<Element> | null>`

Executes the search and returns the first found element. Will return null if no elements are found.

The result may differ from one execution to another especially if targeted element is rendered lately because its data is based on some backend response.

---

### getHandle()

- returns: `Promise<ElementHandle<Element> | null>`

Executes the search and returns the first found element. Will return null if no elements are found.

It is the same method as `getFirstHandleOrNull()`. Choose the method whose name is more friendly to you.

The result may differ from one execution to another especially if targeted element is rendered lately because its data is based on some backend response.

---

### count()

- returns: `Promise<number>`

Gets the number of found elements.

The result may differ from one execution to another especially if targeted element is rendered lately because its data is based on some backend response.

---

### exists()

- returns: `Promise<boolean>`

Checks if the selector exists.

The result may differ from one execution to another especially if targeted element is rendered lately because its data is based on some backend response.

---

### toString()

- returns: `string`

Gets the full query used to build the selector.

Example:

```js
const url = 'https://www.ag-grid.com/example.php';
await pwc
  .withBrowser('chromium')
  .withCursor()
  .withOptions({ headless: false })
  .navigateTo(url);

const agGridContainer = pwc.selector('div.ag-body-viewport');
const checkbox = agGridContainer
  .find('div[role="row"]')
  .withText('Olivia Brennan')
  .nth(1) // take the first row that contains 'Olivia Brennan'
  .find('div[col-id="name"]') // take the cell in column name
  .find('span.ag-selection-checkbox'); // take the checkbox in that cell

console.log(checkbox.toString());
// will produce:
`selector(div.ag-body-viewport)
  .find(div[role="row"])
  .withText(Olivia Brennan)
  .nth(1)
  .find(div[col-id="name"])
  .find(span.ag-selection-checkbox)`;
```

---