# Contributing to playwright-controller

We'd love to accept your patches and contributions and help make this project even better than it is today!

As a contributor, here are the guidelines we would like you to follow:

- [Commit Messages Guidelines](#Commit-Messages-Guidelines)

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
