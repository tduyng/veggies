[![veggies](https://raw.githubusercontent.com/ekino/veggies/master/docs/public/veggies-banner.png)](https://ekino.github.io/veggies/)

[![NPM version][npm-image]][npm-url]
[![Github CI][ci-image]][ci-url]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][x-badge]][x]

Veggies is a Cucumber.js extension library for API and CLI testing. It provides ready-to-use step definitions so you can focus on writing tests instead of infrastructure.

## 📚 Documentation

**Visit [https://ekino.github.io/veggies/](https://ekino.github.io/veggies/) for complete documentation**

Quick links:

- [Getting Started](https://ekino.github.io/veggies/guide/getting-started)
- [HTTP API Testing](https://ekino.github.io/veggies/extensions/http-api)
- [CLI Testing](https://ekino.github.io/veggies/extensions/cli)
- [Snapshot Testing](https://ekino.github.io/veggies/extensions/snapshot)

---

## Quick Start

**Requirements:** Node.js >= 20, @cucumber/cucumber >= 11

### Installation

```bash
pnpm add -D @ekino/veggies @cucumber/cucumber
```

### Setup

Create `features/support/world.js`:

```javascript
const { setWorldConstructor } = require('@cucumber/cucumber')
const { state, fixtures, httpApi, cli, fileSystem, snapshot } = require('@ekino/veggies')

setWorldConstructor(function () {
    state.extendWorld(this)
    fixtures.extendWorld(this)
    httpApi.extendWorld(this)
    cli.extendWorld(this)
    fileSystem.extendWorld(this)
    snapshot.extendWorld(this)
})

state.install()
fixtures.install()
httpApi.install({ baseUrl: 'http://localhost:3000' })
cli.install()
fileSystem.install()
snapshot.install()
```

### Run Tests

```bash
pnpm veggies
```

## Example

```gherkin
Scenario: Create and verify a user
  Given I set request json body
    | username | johndoe              |
    | email    | john@example.com     |
    | age      | 25((number))         |
  When I POST /users
  Then response status code should be 201
  And json response should match
    | field    | matcher | value   |
    | username | equal   | johndoe |
    | id       | defined |         |
  And I pick response json id as userId
  And I GET /users/{{userId}}
  Then response status code should be 200
```

## Features

- **HTTP API Testing** - REST APIs, headers, cookies, request chaining
- **CLI Testing** - Command execution, exit codes, stdout/stderr validation
- **File System Testing** - File operations and content validation
- **Snapshot Testing** - Regression testing for API responses, CLI output, and files
- **State Management** - Share data between steps with placeholders
- **Fixtures** - Load test data from YAML, JSON, JS, or TXT files
- **Type System** - Strongly-typed data in Gherkin (numbers, booleans, arrays, null)
- **Rich Matchers** - equal, contain, match, start with, end with, type checking

See the [documentation](https://ekino.github.io/veggies/) for complete details.

## Examples

Run the included examples:

```bash
pnpm run examples

# Run specific examples
pnpm run examples -- --tags @cli

# Run offline examples only
pnpm run examples -- --tags @offline
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT © [Ekino](https://github.com/ekino)

[npm-image]: https://img.shields.io/npm/v/@ekino/veggies.svg?longCache=true&style=for-the-badge
[npm-url]: https://www.npmjs.com/package/@ekino/veggies
[ci-image]: https://img.shields.io/github/actions/workflow/status/ekino/veggies/release.yml?branch=master&style=for-the-badge
[ci-url]: https://github.com/ekino/veggies/actions/workflows/release.yml
[github-watch-badge]: https://img.shields.io/github/watchers/ekino/veggies.svg?style=social
[github-watch]: https://github.com/ekino/veggies/watchers
[github-star-badge]: https://img.shields.io/github/stars/ekino/veggies.svg?style=social
[github-star]: https://github.com/ekino/veggies/stargazers
[x]: https://x.com/intent/tweet?text=Check%20out%20veggies!%20https://github.com/ekino/veggies%20%F0%9F%91%8D
[x-badge]: https://img.shields.io/twitter/url/https/github.com/ekino/veggies.svg?style=social
