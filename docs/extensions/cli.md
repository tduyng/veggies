# CLI Extension

Test command-line applications with ease. Execute commands, validate output, check exit codes, and snapshot results.

::: tip Setup Required
Add to your `features/support/world.js`:
```javascript
import { cli } from '@ekino/veggies'
cli.install()
```
See [Getting Started](/guide/getting-started) for full setup instructions.
:::

## Quick Example

```gherkin
Scenario: Test Node.js version command
  When I run command node --version
  Then exit code should be 0
  And stdout should match ^v[0-9]+\.[0-9]+\.[0-9]+$
  And stderr should be empty
```

## Running Commands

### Basic Command Execution

```gherkin
When I run command node --version
When I run command npm install
When I run command ls -la
When I run command echo "Hello World"
```

### Commands with Arguments

```gherkin
When I run command git status --short
When I run command npm run test -- --coverage
When I run command node script.js arg1 arg2
```

### Using State Placeholders

```gherkin
Given I set state filename to report.json
When I run command cat {{filename}}
```

## Exit Code Validation

```gherkin
Then exit code should be 0     # Success
Then exit code should be 1     # General error
Then exit code should be 127   # Command not found
Then exit code should be 130   # Terminated by Ctrl+C
```

### Common Exit Codes

| Code | Meaning                 |
| ---- | ----------------------- |
| 0    | Success                 |
| 1    | General errors          |
| 2    | Misuse of shell command |
| 126  | Command cannot execute  |
| 127  | Command not found       |
| 128  | Invalid exit argument   |
| 130  | Terminated by Ctrl+C    |

## Output Validation

### Check if Empty

```gherkin
Then stdout should be empty
Then stderr should be empty
```

### Contains String

```gherkin
Then stdout should contain success
Then stdout should contain "Build completed"
Then stderr should contain warning
Then stderr should contain error: file not found
```

### Does Not Contain

```gherkin
Then stdout should not contain error
Then stderr should not contain deprecated
```

### Regex Matching

```gherkin
Then stdout should match ^v[0-9]+\.[0-9]+\.[0-9]+$
Then stdout should match Test.*passed
Then stderr should match Error: .+

Then stdout should not match failed
Then stderr should not match exception
```

## Working Directory

```gherkin
# Set working directory for commands
Given I set cwd to /path/to/project
Given I set working directory to ./examples

# Commands will now execute from this directory
When I run command ls
```

## Environment Variables

### Set Single Variable

```gherkin
Given I set NODE_ENV environment variable to production
Given I set DEBUG env var to true
```

### Set Multiple Variables

```gherkin
Given I set environment variables
  | NODE_ENV | production |
  | DEBUG    | *          |
  | PORT     | 3000       |
```

## Process Management

### Kill Process with Signal

```gherkin
# Kill process after delay
Given I kill the process with SIGTERM in 5s
Given I kill the process with SIGKILL in 2000ms
Given I kill the process with 9 in 1s
```

Useful for testing:

- Long-running processes
- Signal handling
- Graceful shutdown

**Example:**

```gherkin
Scenario: Test server graceful shutdown
  Given I kill the process with SIGTERM in 3s
  When I run command node server.js
  Then exit code should be 0
  And stdout should contain "Server shutting down gracefully"
```

## Debugging

```gherkin
When I run command npm test
And I dump stdout
And I dump stderr
Then exit code should be 0
```

## Real-World Examples

### Testing a CLI Tool

```gherkin
Scenario: Test CLI help command
  When I run command mycli --help
  Then exit code should be 0
  And stdout should contain Usage:
  And stdout should contain Options:
  And stdout should contain Examples:
```

### Testing npm Scripts

```gherkin
Scenario: Run tests successfully
  When I run command npm test
  Then exit code should be 0
  And stdout should contain "All tests passed"
  And stderr should be empty
```

### Testing Build Process

```gherkin
Scenario: Build TypeScript project
  Given I set cwd to ./my-project
  When I run command npm run build
  Then exit code should be 0
  And stdout should contain "Compiled successfully"
  And stderr should not contain error
```

### Testing Error Handling

```gherkin
Scenario: Invalid command should fail
  When I run command node invalid-command
  Then exit code should not be 0
  And stderr should contain "Cannot find module"
```

### Testing with Environment Variables

```gherkin
Scenario: Run with production config
  Given I set environment variables
    | NODE_ENV | production |
    | API_URL  | https://api.prod.example.com |
  When I run command node app.js
  Then exit code should be 0
  And stdout should contain "Running in production mode"
```

### Testing Git Commands

```gherkin
Scenario: Check git status
  Given I set cwd to /path/to/repo
  When I run command git status --short
  Then exit code should be 0
  And stdout should not contain "M "
  And stdout should not contain "?? "
```

### Testing Long-Running Process

```gherkin
Scenario: Test server startup
  Given I kill the process with SIGTERM in 5s
  When I run command node server.js
  Then exit code should be 0
  And stdout should contain "Server started on port 3000"
  And stdout should contain "Received SIGTERM"
  And stdout should contain "Server closed"
```

### Testing Command Output Format

```gherkin
Scenario: Verify JSON output format
  When I run command node script.js --json
  Then exit code should be 0
  And stdout should match ^\{.*\}$
  And stdout should contain "status"
  And stdout should contain "data"
```

### Testing Package Manager

```gherkin
Scenario: Install dependencies
  Given I set cwd to ./test-project
  When I run command pnpm install
  Then exit code should be 0
  And stdout should contain "dependencies"
  And stderr should not contain "error"
```

### Cross-Platform Testing

```gherkin
Scenario Outline: Test on multiple Node versions
  Given I set NODE_VERSION env variable to <version>
  When I run command node --version
  Then exit code should be 0
  And stdout should contain <version>

  Examples:
    | version |
    | 18      |
    | 20      |
    | 22      |
```

## Snapshot Testing

Combine CLI with snapshot testing:

```gherkin
Scenario: CLI output regression test
  When I run command node generate-report.js
  Then exit code should be 0
  And stdout output should match snapshot
```

See [Snapshot Extension](/extensions/snapshot) for details.

## Low-Level API

Access the CLI client in custom steps:

```javascript
import { When, Then } from '@cucumber/cucumber'

When('I run a custom command', async function () {
    await this.cli.run('node custom-script.js')
})

Then('I check the output', function () {
    const stdout = this.cli.getOutput('stdout')
    const stderr = this.cli.getOutput('stderr')
    const exitCode = this.cli.getExitCode()

    console.log({ stdout, stderr, exitCode })
})

// Available methods:
// - setCwd(directory)
// - getCwd()
// - setEnvironmentVariable(name, value)
// - setEnvironmentVariables(vars)
// - scheduleKillProcess(delay, signal)
// - run(command)
// - getOutput(type) // 'stdout' or 'stderr'
// - getExitCode()
```

## Tips & Best Practices

### ✅ Do's

- Always check exit codes
- Validate both stdout and stderr
- Use working directory for reproducibility
- Test error conditions
- Use snapshots for complex output

### ❌ Don'ts

- Don't rely on command timing (use signals for long processes)
- Don't forget to test error cases
- Don't hardcode absolute paths
- Don't ignore stderr when exit code is 0

### Performance

Commands execute synchronously within a scenario. For faster tests:

```gherkin
# Bad: Running multiple slow commands sequentially
When I run command npm install
And I run command npm run build
And I run command npm test

# Better: Combine into one command if possible
When I run command npm install && npm run build && npm test
```

## Complete Gherkin Reference

### Given Steps

```gherkin
Given I set working directory to {path}
Given I set cwd to {path}
Given I set {name} environment variable to {value}
Given I set {name} env var to {value}
Given I set environment variables
Given I set env variables
Given I kill the process with {signal} in {delay}ms
Given I kill the process with {signal} in {delay}s
```

### When Steps

```gherkin
When I run command {command}
When I dump stdout
When I dump stderr
```

### Then Steps

```gherkin
Then exit code should be {code}
Then the exit code should be {code}
Then command exit code should be {code}
Then stdout should be empty
Then stderr should be empty
Then stdout should contain {text}
Then stderr should contain {text}
Then stdout should not contain {text}
Then stderr should not contain {text}
Then stdout should match {pattern}
Then stderr should match {pattern}
Then stdout should not match {pattern}
Then stderr should not match {pattern}
```

## Next Steps

- [File System Extension](/extensions/file-system) - Test file operations
- [Snapshot Extension](/extensions/snapshot) - Add snapshot testing
- [State Extension](/extensions/state) - Share data between commands
