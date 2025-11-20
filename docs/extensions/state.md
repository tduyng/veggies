# State Extension

Share data between steps and scenarios using a simple key-value store.

::: tip Setup Required
Add to your `features/support/world.js`:
```javascript
import { state } from '@ekino/veggies'
state.install()
```
No dependencies required. Recommended for all setups.  
See [Getting Started](/guide/getting-started) for full setup instructions.
:::

## Why State?

State management solves common testing challenges:

1. **Share data between steps** - Extract a value in one step, use it in another
2. **Dynamic placeholders** - Use `{{key}}` syntax for stored values
3. **Request chaining** - Pass IDs, tokens, URLs between requests
4. **Test data management** - Store computed values, counters, flags

## Basic Usage

### Set Values

```gherkin
Given I set state userId to 123
Given I set state username to johndoe
Given I set state isActive to true((boolean))
```

### Use Values with Placeholders

```gherkin
Given I set state userId to 123
When I GET https://api.example.com/users/{{userId}}
Then response status code should be 200
```

Placeholders work anywhere:

```gherkin
Given I set state baseUrl to https://api.example.com
And I set state userId to 123
When I GET {{baseUrl}}/users/{{userId}}
```

### Debug State

```gherkin
When I dump state
```

Output:

```javascript
{
  userId: 123,
  username: 'johndoe',
  isActive: true,
  authToken: 'abc123xyz'
}
```

### Clear State

```gherkin
When I clear state
```

::: warning Scenario Scope
State is **scenario-scoped** by default. It's automatically cleared between scenarios to ensure test isolation.
:::

## Advanced Patterns

### Chaining Multiple Requests

```gherkin
Scenario: Complete user workflow
  # Create user
  Given I set request json body
    | username | johndoe |
  When I POST /api/users
  And I pick response json id as userId

  # Create post for user
  Given I set request json body
    | user_id | {{userId}}((number)) |
    | title   | Hello World          |
  When I POST /api/posts
  And I pick response json id as postId

  # Fetch user's posts
  When I GET /api/users/{{userId}}/posts
  Then json response should match
    | field  | matcher | value     |
    | [].id  | contain | {{postId}} |
```

### Building Dynamic URLs

```gherkin
Given I set state protocol to https
And I set state domain to api.example.com
And I set state version to v2
And I set state endpoint to users
When I GET {{protocol}}://{{domain}}/{{version}}/{{endpoint}}
```

### Storing Computed Values

```gherkin
# Extract and modify
When I pick response json callback_url as callbackUrl
And I replace {token} in callbackUrl to abc123
Then I GET {{callbackUrl}}
```

### Conditional Logic with State

```gherkin
# Set environment-specific URLs
Given I set state apiUrl to https://api.staging.example.com

# Later steps use the URL
When I GET {{apiUrl}}/users
```

## Working with Complex Data

State stores any JSON-serializable value:

```gherkin
# Numbers
Given I set state count to 42((number))

# Booleans
Given I set state enabled to true((boolean))

# Null
Given I set state metadata to ((null))

# Arrays (stored as CSV strings internally)
Given I set state tags to api,test,user((array))
```

## Integration with HTTP API

State integrates seamlessly with HTTP API extension:

```gherkin
# Extract from JSON response
When I GET /api/users/1
And I pick response json id as userId
And I pick response json email as userEmail
And I pick response json profile.avatar_url as avatarUrl

# Extract from headers
When I POST /api/users
And I pick response header location as userLocation

# Use in subsequent requests
When I GET {{userLocation}}
And I set Email request header to {{userEmail}}
```

## Integration with CLI

Use state in CLI commands:

```gherkin
Given I set state filename to report.json
And I set state format to json
When I run command node generate.js --output {{filename}} --format {{format}}
```

## Real-World Examples

### API Authentication Flow

```gherkin
Scenario: Authenticated API requests
  # Login
  Given I set request json body
    | username | admin  |
    | password | secret |
  When I POST /api/auth/login
  And I pick response json token as authToken

  # Use token for all subsequent requests
  Given I set Authorization request header to Bearer {{authToken}}
  When I GET /api/protected/resource
  Then response status code should be 200
```

### Multi-Step E-Commerce

```gherkin
Scenario: Complete purchase flow
  # Add to cart
  Given I set request json body
    | product_id | 456((number)) |
  When I POST /api/cart
  And I pick response json cart_id as cartId

  # Apply coupon
  When I POST /api/cart/{{cartId}}/coupon
  And I pick response json discount as discount

  # Checkout
  Given I set request json body
    | cart_id  | {{cartId}}((number)) |
    | coupon   | {{discount}}         |
  When I POST /api/checkout
  And I pick response json order_id as orderId

  # Verify order
  When I GET /api/orders/{{orderId}}
  Then json response should match
    | field  | matcher | value     |
    | status | equal   | confirmed |
```

### Testing with Multiple Environments

```gherkin
Scenario Outline: Test across environments
  Given I set state env to <environment>
  And I set state apiUrl to <url>
  When I GET {{apiUrl}}/health
  Then response status code should be 200
  And json response should match
    | field       | matcher | value         |
    | environment | equal   | {{env}}       |

  Examples:
    | environment | url                              |
    | staging     | https://api.staging.example.com  |
    | production  | https://api.example.com          |
```

## Low-Level API

For custom step definitions:

```javascript
import { Given, When, Then } from '@cucumber/cucumber'

Given('I store custom data', function () {
    this.state.set('customKey', { complex: 'data' })
})

When('I use custom data', function () {
    const value = this.state.get('customKey')
    console.log(value) // { complex: 'data' }
})

Then('I check if key exists', function () {
    const exists = this.state.has('customKey') // true/false
})

// Available methods:
// - set(key, value)         // Store value
// - get(key)                // Retrieve value
// - has(key)                // Check if key exists
// - clear()                 // Clear all state
// - dump()                  // Get all state as object
// - populate(string)        // Replace {{placeholders}}
// - populateObject(obj)     // Replace placeholders in object
```

### Populate Examples

```javascript
// Populate string
this.state.set('userId', 123)
const url = this.state.populate('/users/{{userId}}')
// Result: '/users/123'

// Populate object
this.state.set('name', 'John')
this.state.set('age', 25)
const data = this.state.populateObject({
    userName: '{{name}}',
    userAge: '{{age}}',
    email: 'fixed@example.com',
})
// Result: { userName: 'John', userAge: '25', email: 'fixed@example.com' }
```

## Best Practices

### ✅ Do's

- Use descriptive key names (`userId`, not `id`)
- Clear state between unrelated scenarios
- Store only necessary data
- Use typed values with cast syntax
- Document complex state dependencies

### ❌ Don'ts

- Don't share state between independent scenarios
- Don't store large objects (keep it simple)
- Don't use state for test configuration (use fixtures)
- Don't overuse state (keep scenarios readable)

## Placeholder Syntax

Placeholders use double curly braces:

```gherkin
# Single placeholder
{{key}}

# Multiple placeholders
{{protocol}}://{{domain}}:{{port}}/{{path}}

# In any position
Given I set {{headerName}} request header to {{headerValue}}
```

**Where placeholders work:**

- URL paths: `GET {{url}}`
- Headers: `{{headerValue}}`
- Request body: `{{field}}`
- CLI commands: `{{filename}}`
- Fixture references: `{{fixtureName}}`
- Any string in Gherkin tables

## Complete Gherkin Reference

### Given Steps

```gherkin
Given I set state {key} to {value}
```

### When Steps

```gherkin
When I clear state
When I dump state
```

### Then Steps

No dedicated Then steps. State is used via placeholders in other extensions.

## Troubleshooting

### Placeholder Not Replaced

**Problem:** `{{key}}` appears literally in output

**Causes:**

1. Key doesn't exist in state
2. Typo in key name
3. State was cleared

**Solution:**

```gherkin
# Debug state
When I dump state

# Verify key exists before using
Given I set state userId to 123
When I dump state
When I GET /users/{{userId}}
```

### Type Mismatch

**Problem:** Number stored as string

**Solution:** Use type casting:

```gherkin
# Wrong
Given I set state age to 25          # Stored as string "25"

# Correct
Given I set state age to 25((number))  # Stored as number 25
```

## Next Steps

- [Fixtures Extension](/extensions/fixtures) - Load external test data
- [HTTP API Extension](/extensions/http-api) - Use state with API testing
- [Type System](/advanced/type-system) - Learn about type casting
