# Extensions Overview

Veggies provides six independent extensions that work together seamlessly. Each extension adds specific testing capabilities to your Cucumber tests.

## Quick Reference

| Extension | Purpose | Common Use Cases |
|-----------|---------|------------------|
| **[HTTP API](/extensions/http-api)** | Test REST APIs | API testing, microservices, webhooks |
| **[CLI](/extensions/cli)** | Test command-line tools | CLI apps, build scripts, shell commands |
| **[File System](/extensions/file-system)** | Test file operations | File generation, build artifacts, config files |
| **[Snapshot](/extensions/snapshot)** | Regression testing | API responses, CLI output, file contents |
| **[State](/extensions/state)** | Share data between steps | Request chaining, multi-step workflows |
| **[Fixtures](/extensions/fixtures)** | Load external test data | Reusable payloads, clean scenarios |

## Installation

Choose the extensions you need. See [Getting Started](/guide/getting-started) for full setup instructions.

### Minimal Setup (API Testing)

```javascript
import { state, httpApi } from '@ekino/veggies'
httpApi.install({ baseUrl: 'https://api.example.com' })
```

### CLI Testing

```javascript
import { state, cli } from '@ekino/veggies'
cli.install()
```

### Full Suite

```javascript
import { state, fixtures, httpApi, cli, fileSystem, snapshot } from '@ekino/veggies'

state.install()
fixtures.install()
httpApi.install()
cli.install()
fileSystem.install()
snapshot.install()
```

## Extension Dependencies

Some extensions require others to work:

- **State** - No dependencies (but recommended for all)
- **Fixtures** - No dependencies
- **CLI** - No dependencies
- **HTTP API** - Requires: State
- **File System** - Requires: CLI
- **Snapshot** - Works with: HTTP API, CLI, File System

## Extension Details

### 🌐 HTTP API Extension

Make HTTP requests and validate responses with powerful matchers.

**Example:**

```gherkin
Given I set request json body
  | username | john((string))  |
  | age      | 25((number))    |
When I POST https://api.example.com/users
Then response status code should be 201
And json response should match
  | field    | matcher | value |
  | id       | defined |       |
  | username | equal   | john  |
```

**Features:** GET/POST/PUT/DELETE/PATCH, headers, cookies, query params, form data, multipart, response validation, cookie management

[Full documentation →](/extensions/http-api)

---

### 🖥️ CLI Extension

Execute commands and validate output and exit codes.

**Example:**

```gherkin
When I run command node --version
Then exit code should be 0
And stdout should match ^v[0-9]+\.[0-9]+\.[0-9]+$
```

**Features:** Command execution, exit code validation, stdout/stderr validation, environment variables, working directory

[Full documentation →](/extensions/cli)

---

### 📁 File System Extension

Create, read, and validate files and directories.

**Example:**

```gherkin
Given I create directory tmp/test
When I create file tmp/test/config.json with content {"key": "value"}
Then file tmp/test/config.json should exist
And file tmp/test/config.json content should contain key
```

**Features:** File/directory creation, existence checks, content validation, pattern matching

[Full documentation →](/extensions/file-system)

---

### 📸 Snapshot Extension

Capture and compare snapshots for regression testing.

**Example:**

```gherkin
When I GET https://api.example.com/users/1
Then response body should match snapshot

# Update snapshots: pnpm veggies --updateSnapshots
```

**Features:** API snapshots, CLI output snapshots, file snapshots, selective field matching, update/clean modes

[Full documentation →](/extensions/snapshot)

---

### 🔄 State Extension

Store and reuse data across steps using placeholders.

**Example:**

```gherkin
When I POST https://api.example.com/users
And I pick response json id as userId
And I GET https://api.example.com/users/{{userId}}
Then response status code should be 200
```

**Features:** Key-value storage, placeholder syntax (`{{key}}`), request chaining, data sharing

[Full documentation →](/extensions/state)

---

### 📦 Fixtures Extension

Load test data from external files (YAML, JSON, JS, TXT).

**Example:**

```gherkin
Given I load fixtures from users.yaml
When I set request json body from fixture john_doe
Then response json body should match fixture expected_response
```

**Features:** YAML/JSON/JS/TXT support, dynamic data generation, reusable test data

[Full documentation →](/extensions/fixtures)

## Common Patterns

### API + State (Request Chaining)

```gherkin
When I POST /api/users
And I pick response json id as userId
And I GET /api/users/{{userId}}
Then response status code should be 200
```

### CLI + File System

```gherkin
When I run command node generate.js
Then file output.json should exist
And file output.json content should contain "success"
```

### API + Snapshot (Regression Testing)

```gherkin
When I GET /api/users/1
Then response json body should match snapshot
  | field      | matcher | value  |
  | created_at | type    | string |
```

### Complete Workflow

```gherkin
# Create via API
Given I set request json body from fixtures/user
When I POST /api/users
And I pick response json id as userId

# Generate with CLI
When I run command node report.js {{userId}}
Then exit code should be 0

# Verify output
Then file reports/{{userId}}.json should exist
And file reports/{{userId}}.json should match snapshot
```

## Next Steps

- Explore individual extension documentation above
- Check [Advanced Features](/advanced/type-system) for type system and matchers
- See [examples](https://github.com/ekino/veggies/tree/master/examples) for real-world use cases
