# Introduction

Veggies is a comprehensive testing library for [Cucumber.js](https://github.com/cucumber/cucumber-js) that provides ready-to-use step definitions for testing APIs, CLI applications, and file systems.

## The Problem

Cucumber.js is a great BDD framework, but it's just a test runner. To actually test anything, you need to write all your own step definitions.

**Testing a simple API with vanilla Cucumber requires:**

```javascript
// features/support/steps.js
import { Given, When, Then } from '@cucumber/cucumber'
import axios from 'axios'
import assert from 'assert'

let response, headers = {}

Given('I set {string} header to {string}', function (key, value) {
    headers[key] = value
})

When('I GET {string}', async function (url) {
    response = await axios.get(url, { headers })
})

Then('response status code should be {int}', function (code) {
    assert.strictEqual(response.status, code)
})

// ... dozens more step definitions for headers, cookies, JSON validation, etc.
```

**The same test with Veggies:**

```javascript
// features/support/world.js
const { httpApi } = require('@ekino/veggies')
httpApi.extendWorld(this)
httpApi.install()
```

```gherkin
Scenario: Test API
  Given I set User-Agent request header to veggies/1.0
  When I GET https://api.github.com/
  Then response status code should be 200
```

That's it. No custom step definitions needed.

## What is Veggies?

Veggies provides **six powerful extensions** that give you hundreds of ready-to-use Gherkin steps:

### 🌐 HTTP API Extension

Test REST APIs with complete HTTP client capabilities.

```gherkin
# Set headers and body
Given I set User-Agent request header to veggies/1.0
And I set request json body
  | username | john((string))    |
  | age      | 25((number))      |
  | active   | true((boolean))   |

# Make requests
When I POST https://api.example.com/users
Then response status code should be 201

# Validate responses
And json response should match
  | field    | matcher | value       |
  | username | equal   | john        |
  | email    | contain | example.com |
  | id       | defined |             |
```

[Learn more →](/extensions/http-api)

### 🖥️ CLI Extension

Test command-line applications.

```gherkin
When I run command yarn --version
Then exit code should be 0
And stdout should match ^[0-9]+\.[0-9]+\.[0-9]+$
And stderr should be empty
```

[Learn more →](/extensions/cli)

### 📁 File System Extension

Test file and directory operations.

```gherkin
Given I create directory tmp/test
When I create file tmp/test/config.json with content {"debug": true}
Then file tmp/test/config.json should exist
And file tmp/test/config.json content should match snapshot
```

[Learn more →](/extensions/file-system)

### 📸 Snapshot Extension

Capture and compare snapshots of any output.

```gherkin
When I GET https://api.example.com/users/1
Then response body should match snapshot

# Update with: pnpm veggies --updateSnapshots
# Clean with: pnpm veggies --cleanSnapshots
```

[Learn more →](/extensions/snapshot)

### 🔄 State Extension

Share data between steps with placeholders.

```gherkin
When I POST https://api.example.com/users
And I pick response json id as userId

# Reuse the extracted value
And I GET https://api.example.com/users/{{userId}}
Then response status code should be 200
```

[Learn more →](/extensions/state)

### 📦 Fixtures Extension

Load test data from external files.

```gherkin
Given I load fixtures from users.yaml

When I POST https://api.example.com/users
And I set request json body from fixture user_data

Then response json body should match fixture expected_response
```

[Learn more →](/extensions/fixtures)

## Key Features

### 🎯 Type System

Define properly typed data in Gherkin:

```gherkin
Given I set request json body
  | username | john((string))      |
  | age      | 25((number))        |
  | active   | true((boolean))     |
  | tags     | api,test((array))   |
  | score    | 4.5((float))        |
  | meta     | ((null))            |
```

Generates real JSON with correct types:

```json
{
    "username": "john",
    "age": 25,
    "active": true,
    "tags": ["api", "test"],
    "score": 4.5,
    "meta": null
}
```

[Learn more →](/advanced/type-system)

### ✨ Powerful Matchers

Validate data with expressive matchers:

```gherkin
Then json response should match
  | expression              |
  | username    = john      |  # Exact match
  | email       *= example  |  # Contains
  | id          ~= ^[0-9]+$ |  # Regex
  | role        ^= admin    |  # Starts with
  | status      $= _active  |  # Ends with
  | created_at  ?           |  # Is defined
  | age         #= number   |  # Type check
```

[Learn more →](/advanced/matchers)

### 🍪 Cookie Management

```gherkin
Given I enable cookies
When I GET https://example.com/login
Then response should have a session cookie
And response session cookie should be secure
And response session cookie should be http only
```

### 🐛 Debugging Helpers

```gherkin
When I GET https://api.example.com/users
And I dump response body
And I dump response headers
```

## Architecture

Veggies is modular - use only what you need:

```
┌─────────────────────────────────────────┐
│          Your Feature Files             │
│      (Natural Gherkin Scenarios)        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Veggies Extensions              │
│  HTTP API │ CLI │ File System           │
│  Snapshot │ State │ Fixtures            │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│            Cucumber.js                  │
└─────────────────────────────────────────┘
```

## When to Use Veggies

✅ **Perfect For:**

- Testing REST APIs and microservices
- Testing CLI tools and scripts
- End-to-end integration testing
- Regression testing with snapshots
- BDD-style acceptance testing

❌ **Not For:**

- Unit testing (use Jest, Vitest)
- Browser UI testing (use Playwright, Cypress)
- Performance testing (use k6, Artillery)

## Requirements

- **Node.js** >= 20.x
- **@cucumber/cucumber** >= 11.x

## Compatibility

- ✅ ESM and CommonJS
- ✅ TypeScript (with full type definitions)
- ✅ JavaScript

## Next Steps

- [Getting Started](/guide/getting-started) - Install and configure Veggies
- [Extensions Overview](/guide/extensions-overview) - Explore all available extensions

::: tip
Veggies works with existing Cucumber projects! You can add it incrementally without rewriting tests. Mix Veggies steps with your custom steps.
:::
