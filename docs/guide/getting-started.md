# Getting Started

Get up and running with Veggies in under 5 minutes!

## Prerequisites

Before you begin, make sure you have:

- **Node.js** 20.x or higher
- **pnpm** 10.0+ (recommended), or npm/yarn
- Basic familiarity with [Cucumber](https://cucumber.io/) and [Gherkin syntax](https://cucumber.io/docs/gherkin/)

## Installation

### Step 1: Install Veggies and Cucumber

::: code-group

```bash [pnpm]
pnpm add -D @ekino/veggies @cucumber/cucumber
```

```bash [npm]
npm install -D @ekino/veggies @cucumber/cucumber
```

```bash [yarn]
yarn add -D @ekino/veggies @cucumber/cucumber
```

:::

### Step 2: Create Project Structure

Create the following directory structure:

```
your-project/
├── features/
│   ├── support/
│   │   └── world.js
│   └── example.feature
└── package.json
```

```bash
mkdir -p features/support
```

### Step 3: Configure Cucumber World

Create `features/support/world.js` to configure Veggies extensions:

::: code-group

```javascript [ESM]
// features/support/world.js
import { setWorldConstructor } from '@cucumber/cucumber'
import { state, fixtures, httpApi, cli, fileSystem, snapshot } from '@ekino/veggies'

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
httpApi.install({
    baseUrl: 'http://localhost:3000', // Optional: set default base URL
})
cli.install()
fileSystem.install()
snapshot.install()
```

```javascript [CommonJS]
// features/support/world.js
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
httpApi.install({
    baseUrl: 'http://localhost:3000',
})
cli.install()
fileSystem.install()
snapshot.install()
```

:::

::: tip Module System
You can use either ESM or CommonJS - Veggies supports both. Just make sure your `package.json` has the correct `"type"` field.
:::

### Step 4: Choose Your Extensions

You don't need all extensions! Install only what you need:

#### For API Testing Only

```javascript
import { setWorldConstructor } from '@cucumber/cucumber'
import { state, fixtures, httpApi } from '@ekino/veggies'

setWorldConstructor(function () {
    state.extendWorld(this)
    fixtures.extendWorld(this)
    httpApi.extendWorld(this)
})

state.install()
fixtures.install()
httpApi.install({ baseUrl: 'https://api.example.com' })
```

#### For CLI Testing Only

```javascript
import { setWorldConstructor } from '@cucumber/cucumber'
import { state, cli, snapshot } from '@ekino/veggies'

setWorldConstructor(function () {
    state.extendWorld(this)
    cli.extendWorld(this)
    snapshot.extendWorld(this)
})

state.install()
cli.install()
snapshot.install()
```

## Your First Test

Create `features/example.feature`:

```gherkin
Feature: GitHub API

  Scenario: Fetch GitHub API root
    Given I set User-Agent request header to veggies/1.0
    When I GET https://api.github.com/
    Then response status code should be 200
    And json response should match
      | field              | matcher | value |
      | current_user_url   | defined |       |
      | emojis_url         | contain | https |
```

## Running Tests

### Using Veggies CLI (Recommended)

Veggies provides its own CLI that supports all Cucumber options plus additional snapshot features:

::: code-group

```bash [pnpm]
pnpm veggies
```

```bash [npm]
npx veggies
```

```bash [yarn]
yarn veggies
```

:::

### Using Cucumber CLI

You can also use Cucumber directly:

```bash
pnpm cucumber-js
```

### Add npm Scripts

Update your `package.json`:

```json
{
    "scripts": {
        "test": "veggies",
        "test:update-snapshots": "veggies --updateSnapshots",
        "test:clean-snapshots": "veggies --cleanSnapshots"
    }
}
```

Now run:

```bash
pnpm test
```

## CLI Options

Veggies extends Cucumber with additional options:

| Option                       | Description                                    |
| ---------------------------- | ---------------------------------------------- |
| `--updateSnapshots` or `-u`  | Update existing snapshots                      |
| `--cleanSnapshots`           | Remove unused snapshots                        |
| `--preventSnapshotsCreation` | Fail if snapshot doesn't exist (useful for CI) |
| `--help`                     | Show help                                      |

All standard [Cucumber.js CLI options](https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md) are also supported:

```bash
# Run specific tags
pnpm veggies --tags '@api and not @wip'

# Run specific feature
pnpm veggies features/github.feature

# Format output
pnpm veggies --format json:report.json

# Parallel execution
pnpm veggies --parallel 4
```

## Configuration File

Create `cucumber.js` (or `cucumber.mjs` for ESM) in your project root:

::: code-group

```javascript [cucumber.mjs (ESM)]
export default {
    default: {
        paths: ['features/**/*.feature'],
        import: ['features/support/**/*.js'],
        format: ['progress', 'html:report.html'],
        parallel: 2,
    },
}
```

```javascript [cucumber.js (CommonJS)]
module.exports = {
    default: {
        require: ['features/support/**/*.js'],
        format: ['progress', 'html:report.html'],
        parallel: 2,
    },
}
```

:::

## TypeScript Support

Veggies has full TypeScript support with type definitions included.

### 1. Install TypeScript Dependencies

```bash
pnpm add -D typescript tsx @types/node
```

### 2. Configure TypeScript

Create `tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "ES2022",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "strict": true,
        "skipLibCheck": true,
        "types": ["node"]
    },
    "include": ["features/**/*"]
}
```

### 3. Create TypeScript World

Create `features/support/world.ts`:

```typescript
import { setWorldConstructor, World } from '@cucumber/cucumber'
import { state, fixtures, httpApi, cli, fileSystem, snapshot } from '@ekino/veggies'

setWorldConstructor(function (this: World) {
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

### 4. Run with tsx

Update `cucumber.mjs`:

```javascript
export default {
    default: {
        paths: ['features/**/*.feature'],
        import: ['features/support/**/*.ts'],
        requireModule: ['tsx'],
    },
}
```

Or run directly:

```bash
pnpm veggies --require-module tsx --import features/support/**/*.ts
```

## Verification

To verify everything is working, create a simple test:

```gherkin
# features/verify.feature
Feature: Verify Veggies Setup

  Scenario: Test HTTP API extension
    When I GET https://httpbin.org/status/200
    Then response status code should be 200

  Scenario: Test CLI extension
    When I run command node --version
    Then exit code should be 0
    And stdout should match ^v[0-9]+
```

Run it:

```bash
pnpm veggies features/verify.feature
```

You should see:

```
Feature: Verify Veggies Setup

  Scenario: Test HTTP API extension
    ✓ When I GET https://httpbin.org/status/200
    ✓ Then response status code should be 200

  Scenario: Test CLI extension
    ✓ When I run command node --version
    ✓ Then exit code should be 0
    ✓ And stdout should match ^v[0-9]+

2 scenarios (2 passed)
5 steps (5 passed)
```

## Project Structure Best Practices

Here's a recommended project structure:

```
your-project/
├── features/
│   ├── support/
│   │   ├── world.js                 # Veggies configuration
│   │   ├── hooks.js                 # Before/After hooks
│   │   └── custom-steps.js          # Your custom steps
│   ├── fixtures/
│   │   ├── users/
│   │   │   ├── john.json
│   │   │   └── jane.yaml
│   │   └── responses/
│   │       └── expected.json
│   ├── __snapshots__/               # Generated by Veggies
│   │   ├── api.feature.snap
│   │   └── cli.feature.snap
│   ├── api/
│   │   ├── users.feature
│   │   └── auth.feature
│   ├── cli/
│   │   └── commands.feature
│   └── integration/
│       └── end-to-end.feature
├── cucumber.js                       # Cucumber configuration
├── package.json
└── tsconfig.json                     # If using TypeScript
```

## Common Issues

### Issue: "Module not found"

**Solution:** Make sure you're using the correct import syntax for your module system:

- ESM: `import { httpApi } from '@ekino/veggies'`
- CommonJS: `const { httpApi } = require('@ekino/veggies')`

### Issue: "No step definitions found"

**Solution:** Make sure you're installing extensions:

```javascript
httpApi.install() // Don't forget this!
```

### Issue: "Cannot read property 'httpApiClient' of undefined"

**Solution:** Make sure you're extending the world:

```javascript
setWorldConstructor(function () {
    httpApi.extendWorld(this) // Don't forget this!
})
```

### Issue: Snapshots not updating

**Solution:** Use the `--updateSnapshots` flag:

```bash
pnpm veggies --updateSnapshots
```

## Next Steps

Now that you have Veggies set up, explore the extensions:

- [HTTP API Extension](/extensions/http-api) - Test REST APIs
- [CLI Extension](/extensions/cli) - Test command-line tools
- [Snapshot Extension](/extensions/snapshot) - Regression testing
- [State Extension](/extensions/state) - Share data between steps
- [Fixtures Extension](/extensions/fixtures) - Load test data

::: tip
Check out the [examples directory](https://github.com/ekino/veggies/tree/master/examples) in the GitHub repository for more real-world examples!
:::

## Getting Help

- 📖 [Documentation](/)
- 🐛 [GitHub Issues](https://github.com/ekino/veggies/issues)
- 💬 [Discussions](https://github.com/ekino/veggies/discussions)
- 📦 [npm Package](https://www.npmjs.com/package/@ekino/veggies)
