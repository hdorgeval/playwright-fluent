# Contributing to playwright-fluent

We'd love to accept your patches and contributions and help make this project even better than it is today!

As a contributor, here are the guidelines we would like you to follow:

- [Getting Code](#Getting-Code)
- [Commit Messages Guidelines](#Commit-Messages-Guidelines)
- [Documentation Guidelines](#Documentation-Guidelines)
- [Dependencies Guidelines](#Dependencies-Guidelines)

## Getting Code

1. Clone this repository

```bash
git clone https://github.com/hdorgeval/playwright-fluent
cd playwright-fluent
```

2. Install dependencies

```bash
npm install
```

3. Install peer dependencies

```bash
npm run install-peers
```

4. Run tests locally

```bash
npm test
```

## Commit Messages Guidelines

Commit messages should follow the Semantic Commit Messages format:

```
label(namespace): title

description

footer
```

1. _label_ is one of the following:

   - `chore` - build-related work, a change in the package.json file, a change in a configuration file or a change to a script file.
   - `docs` - changes to docs, e.g. `docs(api.md): ..` to change documentation.
   - `feat` - a new feature.
   - `fix` - a bug fix.
   - `refactor` - a code change that neither fixes a bug nor adds a feature
   - `style` - a change in the code style: spaces/alignment/wrapping etc.
   - `test` - adding missing tests or correcting existing tests.

2. _namespace_ is put in parenthesis after label and is mandatory. Must be lowercase.
3. _title_ is a brief summary of changes.
4. _description_ is **optional**, new-line separated from title and is in present tense.
5. _footer_ is **optional**, new-line separated from _description_ and contains "fixes" / "references" attribution to github issues.
6. _footer_ should also include "BREAKING CHANGE" if current API clients will break due to this change. It should explain what changed and how to get the old behavior.

Example:

```
fix(page): fix page.pizza method

This patch fixes page.pizza so that it works with iframes.

Fixes #123, Fixes #234

BREAKING CHANGE: page.pizza now delivers pizza at home by default.
To deliver to a different location, use "deliver" option:
  `page.pizza({deliver: 'work'})`.
```

## Documentation Guidelines

### Markdown Guidelines

- You should follow this [Github Guide on Markdown](https://guides.github.com/features/mastering-markdown/)

### Code Comment

- Comments inside code should be generally avoided. If the code would not be understood without comments, consider re-writing the code to make it self-explanatory.

- You should only comment public methods exposed by the API. Use JSDoc syntax and/or use the VSCode extension [Document This](https://marketplace.visualstudio.com/items?itemName=joelday.docthis)

## Dependencies Guidelines

For all dependencies (both installation and development):

- **Do not add** a dependency if the desired functionality is easily implementable.
- If adding a dependency, it should be well-maintained and trustworthy.

A barrier for introducing new installation dependencies is especially high:

- **Do not add** installation dependency unless it's critical to project success.
