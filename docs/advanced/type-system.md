# Type System

Veggies provides a powerful type system that lets you define strongly-typed data directly in Gherkin scenarios.

## The Problem

In vanilla Cucumber, all data in tables is treated as strings:

```gherkin
# Everything is a string!
Given I set request json body
  | age    | "25"    |  # String, not number
  | active | "true"  |  # String, not boolean
```

This generates:

```json
{
    "age": "25", // Wrong! Should be number
    "active": "true" // Wrong! Should be boolean
}
```

## The Solution

Veggies type directives:

```gherkin
Given I set request json body
  | age    | 25((number))      |
  | active | true((boolean))   |
```

Generates correctly typed JSON:

```json
{
    "age": 25, // ✓ Number
    "active": true // ✓ Boolean
}
```

## Type Directives

| Directive       | Type      | Example           | Output          |
| --------------- | --------- | ----------------- | --------------- |
| `((string))`    | String    | `hello((string))` | `"hello"`       |
| `((number))`    | Number    | `42((number))`    | `42`            |
| `((boolean))`   | Boolean   | `true((boolean))` | `true`          |
| `((array))`     | Array     | `a,b,c((array))`  | `["a","b","c"]` |
| `((null))`      | Null      | `((null))`        | `null`          |
| `((undefined))` | Undefined | `((undefined))`   | `undefined`     |

### Default Behavior

Without a type directive, values are treated as **strings**:

```gherkin
| username | john |    # String: "john"
```

## String Type

Explicit string declaration (usually not needed):

```gherkin
Given I set request json body
  | username | john((string))           |
  | bio      | Software Engineer        |  # Implicit string
  | quote    | "Hello World"((string))  |
```

Result:

```json
{
    "username": "john",
    "bio": "Software Engineer",
    "quote": "\"Hello World\""
}
```

## Number Type

For integers and floats:

```gherkin
Given I set request json body
  | age       | 25((number))           |
  | price     | 19.99((number))        |
  | count     | 0((number))            |
  | negative  | -5((number))           |
  | large     | 1000000((number))      |
```

Result:

```json
{
    "age": 25,
    "price": 19.99,
    "count": 0,
    "negative": -5,
    "large": 1000000
}
```

## Boolean Type

For true/false values:

```gherkin
Given I set request json body
  | active    | true((boolean))        |
  | verified  | false((boolean))       |
  | enabled   | TRUE((boolean))        |  # Case-insensitive
```

Result:

```json
{
    "active": true,
    "verified": false,
    "enabled": true
}
```

## Array Type

Comma-separated values become arrays:

```gherkin
Given I set request json body
  | roles    | admin,user((array))           |
  | tags     | api,test,integration((array)) |
  | empty    | ((array))                     |  # Empty array
  | single   | one((array))                  |  # Single item
```

Result:

```json
{
    "roles": ["admin", "user"],
    "tags": ["api", "test", "integration"],
    "empty": [],
    "single": ["one"]
}
```

::: tip Array Items
Array items are strings by default. For typed arrays, use nested objects or custom steps.
:::

## Null Type

Explicit null values:

```gherkin
Given I set request json body
  | username   | john               |
  | metadata   | ((null))           |
  | deleted_at | ((null))           |
```

Result:

```json
{
    "username": "john",
    "metadata": null,
    "deleted_at": null
}
```

## Undefined Type

Explicit undefined (field won't be included):

```gherkin
Given I set request json body
  | username | john           |
  | optional | ((undefined))  |
```

Result:

```json
{
    "username": "john"
    // optional field is not included
}
```

## Complex Example

Real-world user registration:

```gherkin
Scenario: Create user with typed data
  Given I set request json body
    | username     | johndoe((string))                  |
    | email        | john@example.com                   |
    | age          | 25((number))                       |
    | height       | 1.75((number))                     |
    | active       | true((boolean))                    |
    | verified     | false((boolean))                   |
    | roles        | user,admin((array))                |
    | tags         | api,test((array))                  |
    | metadata     | ((null))                           |
    | internal_id  | ((undefined))                      |
  When I POST /api/users
  Then response status code should be 201
```

Generates:

```json
{
    "username": "johndoe",
    "email": "john@example.com",
    "age": 25,
    "height": 1.75,
    "active": true,
    "verified": false,
    "roles": ["user", "admin"],
    "tags": ["api", "test"],
    "metadata": null
}
```

## Using with State

Combine type system with state placeholders:

```gherkin
Given I set state userId to 123
And I set request json body
  | user_id  | {{userId}}((number))   |
  | username | {{username}}           |
  | active   | true((boolean))        |
```

The placeholder is replaced, then the type is applied:

```json
{
    "user_id": 123, // Number after replacement
    "username": "johndoe",
    "active": true
}
```

## Type Validation

When validating responses, use the `type` matcher:

```gherkin
Then json response should match
  | field    | matcher | value     |
  | id       | type    | number    |
  | username | type    | string    |
  | active   | type    | boolean   |
  | roles    | type    | array     |
  | metadata | type    | object    |
  | deleted  | type    | null      |
```

## Custom Types

Add your own type directives:

```javascript
import { Cast } from '@ekino/veggies'

// Add custom type
Cast.addType('email', (value) => {
    // Transform value
    return value.toLowerCase().trim()
})

// Use in scenarios
```

```gherkin
Given I set request json body
  | email | John@Example.COM((email)) |
```

Result:

```json
{
    "email": "john@example.com"
}
```

### More Custom Type Examples

```javascript
// Date type
Cast.addType('date', (value) => {
    return new Date(value).toISOString()
})

// UUID type
Cast.addType('uuid', (value) => {
    return crypto.randomUUID()
})

// Uppercase type
Cast.addType('upper', (value) => {
    return value.toUpperCase()
})
```

## Type Casting in Custom Steps

Use the Cast helper in your own steps:

```javascript
import { Given } from '@cucumber/cucumber'
import * as Cast from '@ekino/veggies'

Given('I set custom data', function (dataTable) {
    // Cast data table values
    const data = Cast.objects(dataTable.rowsHash())

    // Now data has proper types
    this.httpApiClient.setJsonBody(data)
})

// Available cast methods:
// - Cast.value(string)           // Cast single value
// - Cast.array(rows)             // Cast array of values
// - Cast.objects(object)         // Cast object properties
// - Cast.getCastedValue(value)   // Get casted value
// - Cast.getCastedObject(obj)    // Get casted object
```

## Best Practices

### ✅ Do's

- Always type numbers: `42((number))`
- Always type booleans: `true((boolean))`
- Use null explicitly: `((null))`
- Type arrays: `item1,item2((array))`
- Validate types in responses

### ❌ Don'ts

- Don't forget type directives for non-strings
- Don't mix types in arrays
- Don't use quotes with numbers: `"42"((number))` → `42((number))`

## Common Patterns

### Optional Fields

```gherkin
Given I set request json body
  | username  | required-field       |
  | optional1 | ((undefined))        |
  | optional2 | provided-value       |
```

### Flags and Toggles

```gherkin
Given I set request json body
  | is_active       | true((boolean))   |
  | email_verified  | false((boolean))  |
  | admin           | false((boolean))  |
```

### Counters and IDs

```gherkin
Given I set request json body
  | user_id   | 123((number))       |
  | post_id   | 456((number))       |
  | count     | 0((number))         |
  | page      | 1((number))         |
  | limit     | 10((number))        |
```

### Multi-Value Fields

```gherkin
Given I set request json body
  | roles       | admin,user,moderator((array))  |
  | permissions | read,write,delete((array))     |
  | tags        | urgent,bug((array))            |
```

## Troubleshooting

### Type Not Applied

**Problem:** Number appears as string

```gherkin
# Wrong
| age | "25"((number)) |

# Correct
| age | 25((number)) |
```

### Boolean Not Working

**Problem:** Boolean appears as string

```gherkin
# Wrong
| active | "true" |

# Correct
| active | true((boolean)) |
```

### Array Not Splitting

**Problem:** Array appears as single string

```gherkin
# Wrong
| roles | admin,user |

# Correct
| roles | admin,user((array)) |
```

## Next Steps

- [Advanced Matchers](/advanced/matchers) - Learn response validation
- [HTTP API Extension](/extensions/http-api) - Use types in API tests
- [State Extension](/extensions/state) - Combine with placeholders
