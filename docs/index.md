---
layout: home

hero:
    name: 'Veggies'
    text: 'Extensions for Cucumber.js'
    tagline: Ready-to-use step definitions for API, CLI, and snapshot testing with natural Gherkin syntax
    image:
        src: /veggies-banner.png
        alt: Veggies
    actions:
        - theme: brand
          text: Get Started
          link: /guide/getting-started
        - theme: alt
          text: Introduction
          link: /guide/introduction
        - theme: alt
          text: View on GitHub
          link: https://github.com/ekino/veggies

features:
    - icon: 🌐
      title: HTTP API Testing
      details: Test REST APIs with ready-made Gherkin steps. Set headers, send requests, validate responses, manage cookies, and extract values for chaining requests.
      link: /extensions/http-api
      linkText: Learn more

    - icon: 🖥️
      title: CLI Application Testing
      details: Test command-line tools with simple steps. Run commands, check exit codes, validate stdout/stderr output with built-in matchers and assertions.
      link: /extensions/cli
      linkText: Learn more

    - icon: 📸
      title: Snapshot Testing
      details: Capture and compare API responses, CLI outputs, and file contents. Automatically manage snapshots with update and clean modes.
      link: /extensions/snapshot
      linkText: Learn more

    - icon: 📁
      title: File System Operations
      details: Create directories, check file existence, validate file contents with powerful matchers - all from readable Gherkin syntax.
      link: /extensions/file-system
      linkText: Learn more

    - icon: 🔄
      title: State Management
      details: Share data between steps and scenarios. Extract values from responses, store them, and reuse with simple placeholder syntax.
      link: /extensions/state
      linkText: Learn more

    - icon: 📦
      title: Flexible Fixtures
      details: Load test data from YAML, JSON, JavaScript, or text files. Keep your scenarios clean and maintainable with external test data.
      link: /extensions/fixtures
      linkText: Learn more

    - icon: 🎯
      title: Powerful Type System
      details: Define typed data in Gherkin with simple directives. Work with strings, numbers, booleans, arrays, null, and undefined values.
      link: /advanced/type-system
      linkText: Learn more

    - icon: ✨
      title: Rich Matchers
      details: Validate data with expressive matchers - equal, contain, match, start with, end with, type checking, and date comparisons.
      link: /advanced/matchers
      linkText: Learn more

    - icon: 🔧
      title: Extensible Architecture
      details: Build custom step definitions on top of Veggies. Access low-level APIs for advanced use cases while keeping scenarios readable.
---

## Quick Example

Here's how simple it is to test an API with Veggies:

```gherkin
Scenario: Create and verify a user
  # Set request data
  Given I set request json body
    | username  | johndoe          |
    | email     | john@example.com |
    | age       | 25((number))     |

  # Make the request
  When I POST https://api.example.com/users

  # Validate the response
  Then response status code should be 201
  And json response should match
    | field    | matcher | value |
    | username | equal   | johndoe |
    | email    | contain | example.com |
    | id       | defined |       |

  # Extract and reuse data
  And I pick response json id as userId
  And I GET https://api.example.com/users/{{userId}}
  Then response status code should be 200
```

## Why Choose Veggies?

### 📖 Natural Language Testing

Write tests in plain English using Gherkin syntax. Non-technical stakeholders can read and understand your test scenarios.

### 🚀 Batteries Included

No need to write step definitions for common testing tasks. Veggies provides hundreds of ready-to-use steps for API, CLI, and file system testing.

### 🔗 Request Chaining

Extract values from one response and use them in subsequent requests. Build complex test flows naturally.

### 🎭 Flexible Assertions

Match exact values, patterns, types, or use snapshots. Choose the right level of precision for each test case.

### 🔍 Type-Safe Data

Define strongly-typed test data directly in Gherkin scenarios. Work with numbers, booleans, arrays, and more.

### 🧩 Modular Design

Use only the extensions you need. Each extension (HTTP API, CLI, File System, Snapshot, State, Fixtures) works independently.

## Perfect For

- **API Testing**: REST APIs, GraphQL, WebHooks
- **CLI Testing**: Command-line tools, build scripts, utilities
- **Integration Testing**: End-to-end workflows with multiple services
- **Regression Testing**: Snapshot testing for UI, API responses, or any output
- **Contract Testing**: Validate API contracts with readable scenarios

## Built With Modern Tech

- ✅ TypeScript for type safety
- ✅ Axios for HTTP requests
- ✅ Native Node.js for CLI execution
- ✅ Beautiful diff comparisons
- ✅ Full ESM and CommonJS support
- ✅ Node.js 20+ compatibility

## Get Started in Minutes

```bash
# Install
pnpm add -D @ekino/veggies @cucumber/cucumber

# Configure (one-time setup)
# See Getting Started guide

# Run tests
pnpm veggies
```

[Get Started →](/guide/getting-started)

## What Makes Veggies Different?

Compared to vanilla Cucumber, Veggies provides:

| Feature                 | Vanilla Cucumber              | With Veggies                       |
| ----------------------- | ----------------------------- | ---------------------------------- |
| **HTTP Requests**       | Write custom step definitions | ✅ 30+ built-in steps              |
| **Response Validation** | Write custom assertions       | ✅ Flexible matchers included      |
| **Request Chaining**    | Manual state management       | ✅ Automatic with placeholders     |
| **Type System**         | String-only in Gherkin        | ✅ Numbers, booleans, arrays, null |
| **Snapshot Testing**    | Manual implementation         | ✅ Built-in with auto-management   |
| **Cookie Handling**     | Complex custom code           | ✅ Simple enable/disable           |
| **CLI Testing**         | Custom spawn/exec wrappers    | ✅ 15+ built-in steps              |
| **File Operations**     | Manual fs operations          | ✅ Gherkin-based file testing      |

## Community

- [GitHub](https://github.com/ekino/veggies) - Source code and issues
- [npm](https://www.npmjs.com/package/@ekino/veggies) - Package registry
- [Changelog](https://github.com/ekino/veggies/blob/master/CHANGELOG.md) - Release notes

## License

MIT © [Ekino](https://github.com/ekino)
