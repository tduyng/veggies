# Snapshot Testing

Capture and compare snapshots of API responses, CLI outputs, and file contents for regression testing.

::: tip Setup Required
Add to your `features/support/world.js`:
```javascript
import { snapshot } from '@ekino/veggies'
snapshot.install()
```
Works with: [HTTP API](/extensions/http-api), [CLI](/extensions/cli), [File System](/extensions/file-system)  
See [Getting Started](/guide/getting-started) for full setup instructions.
:::

## How It Works

1. **First run**: Snapshot doesn't exist → Creates it
2. **Subsequent runs**: Compares current output with saved snapshot
3. **Mismatch**: Test fails with diff showing what changed
4. **Update mode**: `--updateSnapshots` overwrites existing snapshots

## Snapshot Storage

Snapshots are stored in `__snapshots__` directory next to your feature files:

```
features/
├── api/
│   ├── __snapshots__/
│   │   └── users.feature.snap
│   └── users.feature
├── cli/
│   ├── __snapshots__/
│   │   └── commands.feature.snap
│   └── commands.feature
```

**Snapshot naming pattern:**

```
{Scenario Name} {occurrence}.{step}
```

Example: `Create User 1.1`, `Create User 1.2`

## API Response Snapshots

### Simple Body Snapshot

```gherkin
Scenario: User API returns consistent data
  When I GET https://api.example.com/users/1
  Then response body should match snapshot
```

### JSON Snapshot with Selective Matching

Ignore dynamic fields like timestamps or IDs:

```gherkin
Scenario: User API with dynamic fields
  When I GET https://api.example.com/users/1
  Then response json body should match snapshot
    | field      | matcher | value  |
    | id         | type    | number |
    | created_at | type    | string |
    | updated_at | type    | string |
```

This will:

- Match exact values for all other fields
- Only check **type** for id, created_at, updated_at
- Save snapshot with those fields showing their types

## CLI Output Snapshots

### Stdout/Stderr Snapshots

```gherkin
Scenario: CLI output is consistent
  When I run command node generate-report.js
  Then exit code should be 0
  And stdout output should match snapshot
  And stderr output should match snapshot
```

### JSON CLI Output

```gherkin
Scenario: CLI JSON output
  When I run command node script.js --json
  Then exit code should be 0
  And stdout json output should match snapshot
    | field     | matcher | value  |
    | timestamp | type    | number |
```

## File Content Snapshots

### Plain File Snapshot

```gherkin
Scenario: Generated file matches expected
  Given I set cwd to ./output
  When I run command node generate.js
  Then file report.txt should match snapshot
```

### JSON File Snapshot

```gherkin
Scenario: Config file is generated correctly
  When I run command node init-config.js
  Then json file config.json content should match snapshot
    | field       | matcher | value  |
    | version     | type    | string |
    | generatedAt | type    | number |
```

## Managing Snapshots

### Update Snapshots

When you intentionally change output:

```bash
# Update all snapshots
pnpm veggies --updateSnapshots
pnpm veggies -u

# Update specific feature
pnpm veggies users.feature --updateSnapshots

# Update with tags
pnpm veggies --tags @api --updateSnapshots
```

::: warning
Use `--updateSnapshots` carefully! It overwrites existing snapshots. Review changes with git diff.
:::

### Clean Unused Snapshots

Remove snapshots no longer referenced by any test:

```bash
pnpm veggies --cleanSnapshots
```

::: danger
Don't use `--cleanSnapshots` with `--tags`! It might delete snapshots for tests not run.
:::

### Prevent Snapshot Creation (CI)

Fail if snapshot doesn't exist instead of creating it:

```bash
# Useful in CI to catch missing snapshots
pnpm veggies --preventSnapshotsCreation
```

## Real-World Examples

### API Regression Testing

```gherkin
Feature: User API Regression Tests

  Scenario: User list endpoint
    When I GET /api/users
    Then response status code should be 200
    And response json body should match snapshot
      | field        | matcher | value |
      | [].id        | type    | number |
      | [].createdAt | type    | string |

  Scenario: User detail endpoint
    When I GET /api/users/1
    Then response status code should be 200
    And response json body should match snapshot
      | field      | matcher | value |
      | id         | type    | number |
      | created_at | type    | string |
```

### CLI Report Generation

```gherkin
Scenario: Generate monthly report
  Given I set environment variables
    | YEAR  | 2024 |
    | MONTH | 01   |
  When I run command node scripts/generate-report.js
  Then exit code should be 0
  And stdout output should match snapshot
```

### Configuration File Testing

```gherkin
Scenario: Initialize project config
  Given I set cwd to ./test-project
  When I run command npx create-config --name myapp
  Then json file package.json content should match snapshot
    | field   | matcher | value  |
    | version | type    | string |
```

### Complex API Response

```gherkin
Scenario: Dashboard API aggregates data correctly
  When I GET /api/dashboard/stats
  Then response json body should match snapshot
    | field                  | matcher | value  |
    | timestamp              | type    | number |
    | data.users.lastUpdated | type    | string |
    | data.posts.lastUpdated | type    | string |
    | data.views.*.date      | type    | string |
```

## Snapshot File Format

Snapshots are stored in a readable format:

```javascript
exports[`Create User 1.1`] = `
{
  "id": 123,
  "username": "johndoe",
  "email": "john@example.com",
  "created_at": "2024-01-01T00:00:00Z",
  "profile": {
    "bio": "Software developer",
    "location": "San Francisco"
  }
}
`

exports[`Create User 1.2`] = `
{
  "id": 123,
  "username": "johndoe",
  "posts": []
}
`
```

## Best Practices

### ✅ Do's

1. **Version control snapshots** - Commit them to git
2. **Review snapshot changes** - Use `git diff` before committing
3. **Ignore dynamic fields** - Use type matchers for timestamps, IDs
4. **Keep snapshots small** - Test specific endpoints, not entire databases
5. **Update intentionally** - Only use `-u` when you meant to change output

### ❌ Don'ts

1. **Don't snapshot everything** - Use for regression, not validation
2. **Don't ignore snapshot diffs** - They often reveal bugs
3. **Don't clean with tags** - `--cleanSnapshots` + `--tags` = data loss
4. **Don't snapshot unstable data** - Random UUIDs, current time, etc.
5. **Don't auto-update in CI** - Snapshots should fail on mismatch

### When to Use Snapshots

✅ **Good for:**

- Regression testing (detecting unexpected changes)
- Complex output validation
- Report generation
- Configuration files
- Documentation generation
- Generated code

❌ **Not good for:**

- Validating specific business logic (use matchers)
- Dynamic data that changes every run
- Testing random/non-deterministic output

## Snapshot Diff Output

When a snapshot doesn't match, you see a beautiful diff:

```diff
Expected
- Received

{
  "id": 123,
  "username": "johndoe",
- "email": "john@example.com",
+ "email": "john@newdomain.com",
  "profile": {
-   "bio": "Software developer",
+   "bio": "Senior Software Engineer",
    "location": "San Francisco"
  }
}
```

## Workflow

### Development Workflow

```bash
# 1. Write test
# 2. Run test (creates snapshot)
pnpm test

# 3. Verify snapshot looks correct
git diff

# 4. Commit snapshot
git add features/__snapshots__
git commit -m "Add user API snapshot test"

# 5. Later, code changes
# 6. Test fails with diff
pnpm test

# 7a. Change was intentional → update snapshot
pnpm test --updateSnapshots
git add features/__snapshots__
git commit -m "Update snapshot after API change"

# 7b. Change was a bug → fix code
# Fix the bug
pnpm test # Now passes
```

### CI/CD Workflow

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: pnpm/action-setup@v2
            - run: pnpm install
            - run: pnpm test --preventSnapshotsCreation
```

## Low-Level API

```javascript
import { Then } from '@cucumber/cucumber'

Then('custom snapshot test', function () {
    const data = { custom: 'data' }

    // Match any data
    this.snapshot.expectToMatch(data)

    // Match JSON with spec
    this.snapshot.expectToMatchJson(data, [{ field: 'id', matcher: 'type', value: 'number' }])
})

// Available methods:
// - expectToMatch(content)
// - expectToMatchJson(content, spec)
```

## Troubleshooting

### Snapshot Not Updating

**Problem:** Snapshot isn't updating with `-u`

**Solution:** Make sure you're running the same scenario:

```bash
# Run specific scenario
pnpm veggies features/users.feature:10 -u

# Or by name
pnpm veggies --name "Create User" -u
```

### Snapshot Diff Too Large

**Problem:** Huge diff makes it hard to see what changed

**Solution:** Break into smaller snapshots:

```gherkin
# Instead of one big snapshot
Then response body should match snapshot

# Use multiple smaller snapshots
Then response json body.users should match snapshot
And response json body.posts should match snapshot
```

### Git Merge Conflicts

**Problem:** Snapshot merge conflicts

**Solution:**

1. Accept both changes
2. Run tests with `-u` to regenerate
3. Verify with `git diff`

## Complete Gherkin Reference

### API Snapshots

```gherkin
Then response body should match snapshot
Then response json body should match snapshot
  | field | matcher | value |
```

### CLI Snapshots

```gherkin
Then stdout output should match snapshot
Then stderr output should match snapshot
Then stdout json output should match snapshot
  | field | matcher | value |
Then stderr json output should match snapshot
  | field | matcher | value |
```

### File Snapshots

```gherkin
Then file {path} should match snapshot
Then json file {path} content should match snapshot
  | field | matcher | value |
```

## Next Steps

- [HTTP API Extension](/extensions/http-api) - API testing basics
- [CLI Extension](/extensions/cli) - CLI testing basics
- [Advanced Matchers](/advanced/matchers) - Learn all matchers
