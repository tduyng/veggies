# File System Extension

Test file operations, validate file contents, and verify directory structures.

::: tip Setup Required
Add to your `features/support/world.js`:
```javascript
import { fileSystem } from '@ekino/veggies'
fileSystem.install()
```
Requires: [CLI extension](/extensions/cli) for working directory  
See [Getting Started](/guide/getting-started) for full setup instructions.
:::

## Quick Example

```gherkin
Scenario: Verify generated files
  Given I set cwd to ./output
  Then file report.json should exist
  And file report.json content should contain "status": "success"
```

## Creating Files and Directories

### Create Directory

```gherkin
Given I create directory output
Given I create directory nested/path/to/dir
```

Creates directory recursively (like `mkdir -p`).

### Remove Files/Directories

```gherkin
Given I remove file report.json
Given I remove directory temp
Given I remove file path/to/nested/file.txt
```

## Checking Existence

### File Existence

```gherkin
Then file package.json should exist
Then file missing.txt should not exist
```

### Directory Existence

```gherkin
Then directory node_modules should exist
Then directory temp should not exist
```

## Content Validation

### Equal Match

Exact content match:

```gherkin
Then file message.txt content should equal Hello World
Then file config.txt content should not equal invalid
```

### Contains

Check if file contains text:

```gherkin
Then file README.md content should contain Veggies
Then file output.log content should contain success
Then file error.log content should not contain FATAL
```

### Regex Match

Pattern matching:

```gherkin
Then file version.txt content should match ^v?[0-9]+\.[0-9]+\.[0-9]+$
Then file timestamp.txt content should match ^\d{4}-\d{2}-\d{2}
Then file output.txt content should not match error|warning
```

## Working Directory

File paths are relative to the current working directory:

```gherkin
# Set working directory
Given I set cwd to ./test-project

# Now all file operations are relative to ./test-project
Then file package.json should exist
Then file src/index.js should exist
```

## Real-World Examples

### Testing File Generation

```gherkin
Scenario: Generate configuration file
  Given I set cwd to ./my-project
  And I create directory config
  When I run command node scripts/generate-config.js
  Then file config/app.json should exist
  And file config/app.json content should contain "version"
  And file config/app.json content should match "env":\s*"production"
```

### Testing Build Output

```gherkin
Scenario: Verify build artifacts
  Given I set cwd to ./my-app
  When I run command npm run build
  Then directory dist should exist
  And file dist/index.js should exist
  And file dist/index.js.map should exist
  And file dist/index.js content should not contain console.log
```

### Testing CLI Output to File

```gherkin
Scenario: Export data to file
  When I run command node export.js --format json --output data.json
  Then exit code should be 0
  And file data.json should exist
  And file data.json content should contain "exported_at"
  And file data.json content should match ^\{.*\}$
```

### Testing File Cleanup

```gherkin
Scenario: Clean temporary files
  Given I create directory temp
  And I run command node process.js --temp temp
  When I run command node cleanup.js
  Then directory temp should not exist
```

### Testing Report Generation

```gherkin
Scenario: Generate test report
  Given I set cwd to ./project
  When I run command npm test -- --reporter json --output-file report.json
  Then exit code should be 0
  And file report.json should exist
  And file report.json content should contain "tests"
  And file report.json content should contain "passes"
  And file report.json content should not contain "failures": 0
```

### Configuration File Validation

```gherkin
Scenario: Validate generated config
  When I run command node init-config.js --env production
  Then file config.json should exist
  And file config.json content should contain "production"
  And file config.json content should match "port":\s*\d+
  And file config.json content should not contain "debug": true
```

### Testing File Transformations

```gherkin
Scenario: Transform CSV to JSON
  Given file input.csv should exist
  When I run command node transform.js input.csv output.json
  Then exit code should be 0
  And file output.json should exist
  And file output.json content should match ^\[.*\]$
```

## With Snapshot Testing

Combine file system with snapshots:

```gherkin
Scenario: Config file regression test
  When I run command node generate-config.js
  Then file config.json should exist
  And json file config.json content should match snapshot
    | field     | matcher | value  |
    | timestamp | type    | number |
```

See [Snapshot Extension](/extensions/snapshot) for details.

## Low-Level API

Access file system operations in custom steps:

```javascript
import { Then } from '@cucumber/cucumber'

Then('I perform custom file operation', async function () {
    const cwd = this.cli.getCwd()

    // Check existence
    const info = await this.fileSystem.getFileInfo(cwd, 'file.txt')
    console.log(info) // File stats or undefined

    // Read content
    const content = await this.fileSystem.getFileContent(cwd, 'file.txt')
    console.log(content)

    // Create directory
    this.fileSystem.createDirectory(cwd, 'new-dir')

    // Remove file/directory
    this.fileSystem.remove(cwd, 'file.txt')
})

// Available methods:
// - getFileInfo(cwd, path)        // Returns fs.Stats or undefined
// - getFileContent(cwd, path)     // Returns file content as string
// - createDirectory(cwd, path)    // Creates directory recursively
// - remove(cwd, path)             // Removes file or directory
```

## Path Handling

### Relative Paths

```gherkin
Given I set cwd to ./project
Then file src/index.js should exist
Then file ../sibling/file.txt should exist
```

### Absolute Paths

```gherkin
# Not recommended - use relative paths for portability
Then file /absolute/path/to/file.txt should exist
```

### Nested Paths

```gherkin
Then file deeply/nested/directory/file.txt should exist
Then directory path/to/dir should exist
```

## Best Practices

### ✅ Do's

- Use relative paths from working directory
- Clean up created files/directories after tests
- Verify file existence before checking content
- Use meaningful working directories
- Test file operations in isolation

### ❌ Don'ts

- Don't use absolute paths (not portable)
- Don't leave test files in production directories
- Don't assume files exist without checking
- Don't test large binary files
- Don't modify files outside test directories

## Common Patterns

### Setup and Teardown

```gherkin
Scenario: Test with temporary directory
  Given I create directory temp-test
  And I set cwd to temp-test

  # Test operations
  When I run command node ../script.js
  Then file output.txt should exist

  # Cleanup
  And I set cwd to ..
  And I remove directory temp-test
```

### Multiple File Validation

```gherkin
Scenario: Verify multiple outputs
  When I run command node generate-all.js
  Then file output1.json should exist
  And file output2.json should exist
  And file output3.json should exist
  And file output1.json content should contain "result"
  And file output2.json content should contain "result"
  And file output3.json content should contain "result"
```

### Conditional File Checks

```gherkin
Scenario: Debug mode creates log file
  Given I set DEBUG env variable to true
  When I run command node app.js
  Then file debug.log should exist
  And file debug.log content should not be empty

Scenario: Production mode has no debug log
  Given I set DEBUG env variable to false
  When I run command node app.js
  Then file debug.log should not exist
```

## Integration with Other Extensions

### With CLI

```gherkin
Scenario: CLI generates files
  When I run command node generate.js
  Then exit code should be 0
  And file output.txt should exist
```

### With Snapshots

```gherkin
Scenario: Generated file matches snapshot
  When I run command node generate.js
  Then file output.json should match snapshot
```

### With State

```gherkin
Scenario: Use filename from state
  Given I set state filename to report.json
  When I run command node generate.js --output {{filename}}
  Then file {{filename}} should exist
```

## Complete Gherkin Reference

### Given Steps

```gherkin
Given I create directory {path}
Given I remove file {path}
Given I remove directory {path}
```

### Then Steps

```gherkin
Then file {path} should exist
Then file {path} should not exist
Then directory {path} should exist
Then directory {path} should not exist
Then file {path} content should equal {value}
Then file {path} content should not equal {value}
Then file {path} content should contain {value}
Then file {path} content should not contain {value}
Then file {path} content should match {pattern}
Then file {path} content should not match {pattern}
```

## Troubleshooting

### File Not Found

**Problem:** File should exist but doesn't

**Solutions:**

1. Check working directory:

```gherkin
When I dump state  # Check cwd
```

2. List directory contents:

```gherkin
When I run command ls -la
And I dump stdout
```

3. Use absolute path temporarily to debug

### Permission Errors

**Problem:** Cannot create/remove files

**Solutions:**

1. Check directory permissions
2. Ensure parent directory exists
3. Run with appropriate user permissions

### Content Mismatch

**Problem:** Content doesn't match expected

**Solutions:**

1. Dump file content:

```gherkin
When I run command cat file.txt
And I dump stdout
```

2. Check encoding issues
3. Verify line endings (CRLF vs LF)

## Next Steps

- [CLI Extension](/extensions/cli) - Execute commands
- [Snapshot Extension](/extensions/snapshot) - Snapshot file contents
- [State Extension](/extensions/state) - Dynamic file paths
