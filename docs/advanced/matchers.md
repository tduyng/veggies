# Advanced Matchers

Veggies provides a rich set of matchers for validating JSON responses, giving you flexible and expressive test assertions.

## Matcher Overview

| Matcher                      | Short | Description              | Example             |
| ---------------------------- | ----- | ------------------------ | ------------------- |
| `equal` / `equals`           | `=`   | Exact match              | `name = john`       |
| `contain` / `contains`       | `*=`  | Contains substring/value | `email *= @example` |
| `match` / `matches`          | `~=`  | Regex pattern            | `id ~= ^[0-9]+$`    |
| `start with` / `starts with` | `^=`  | Starts with value        | `url ^= https://`   |
| `end with` / `ends with`     | `$=`  | Ends with value          | `file $= .json`     |
| `defined` / `present`        | `?`   | Not undefined            | `id ?`              |
| `type`                       | `#=`  | Type checking            | `age #= number`     |
| `equalRelativeDate`          | N/A   | Date comparison          | See below           |

## Syntax Forms

### Long Form (Verbose)

```gherkin
Then json response should match
  | field    | matcher | value    |
  | username | equal   | johndoe  |
  | email    | contain | example  |
```

### Short Form (Compact)

```gherkin
Then json response should match
  | expression              |
  | username = johndoe      |
  | email *= example        |
```

Both forms are equivalent. Use what's more readable for your team!

## Equal Matcher

Exact value comparison:

```gherkin
Then json response should match
  | field      | matcher | value        |
  | username   | equal   | johndoe      |
  | status     | equals  | active       |
  | age        | =       | 25           |
```

**Short form:**

```gherkin
Then json response should match
  | expression          |
  | username = johndoe  |
  | status = active     |
  | age = 25            |
```

**Works with:**

- Strings
- Numbers
- Booleans
- null

## Contain Matcher

Check if value contains substring or array contains element:

```gherkin
Then json response should match
  | field       | matcher | value        |
  | email       | contain | @example.com |
  | description | contains| software     |
  | tags        | *=      | api          |
```

**Short form:**

```gherkin
Then json response should match
  | expression                 |
  | email *= @example.com      |
  | description *= software    |
  | tags *= api                |
```

**Works with:**

- Strings (substring match)
- Arrays (element present)

## Match Matcher

Regex pattern matching:

```gherkin
Then json response should match
  | field       | matcher | value              |
  | id          | match   | ^[0-9]+$           |
  | email       | matches | ^[^@]+@[^@]+\.[^@]+$ |
  | phone       | ~=      | ^\+?[0-9]{10,}$    |
```

**Short form:**

```gherkin
Then json response should match
  | expression                      |
  | id ~= ^[0-9]+$                  |
  | email ~= ^[^@]+@[^@]+\.[^@]+$   |
  | phone ~= ^\+?[0-9]{10,}$        |
```

**Common patterns:**

```gherkin
# UUID
| id ~= ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ |

# ISO date
| created_at ~= ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2} |

# Semantic version
| version ~= ^v?\d+\.\d+\.\d+$ |

# URL
| callback_url ~= ^https?://[^\s]+$ |

# Email
| email ~= ^[^\s@]+@[^\s@]+\.[^\s@]+$ |
```

## Start With Matcher

Check if value starts with a prefix:

```gherkin
Then json response should match
  | field       | matcher    | value    |
  | url         | start with | https:// |
  | name        | starts with| Mr.      |
  | id          | ^=         | user_    |
```

**Short form:**

```gherkin
Then json response should match
  | expression              |
  | url ^= https://         |
  | name ^= Mr.             |
  | id ^= user_             |
```

## End With Matcher

Check if value ends with a suffix:

```gherkin
Then json response should match
  | field       | matcher  | value        |
  | email       | end with | @example.com |
  | filename    | ends with| .json        |
  | domain      | $=       | .com         |
```

**Short form:**

```gherkin
Then json response should match
  | expression                  |
  | email $= @example.com       |
  | filename $= .json           |
  | domain $= .com              |
```

## Defined Matcher

Check if field exists (not undefined):

```gherkin
Then json response should match
  | field      | matcher | value |
  | id         | defined |       |
  | username   | present |       |
  | email      | ?       |       |
```

**Short form:**

```gherkin
Then json response should match
  | expression |
  | id ?       |
  | username ? |
  | email ?    |
```

**Use cases:**

- Ensure required fields exist
- Check optional fields are present
- Validate API contract

## Type Matcher

Validate data types:

```gherkin
Then json response should match
  | field       | matcher | value     |
  | id          | type    | number    |
  | username    | type    | string    |
  | active      | type    | boolean   |
  | tags        | type    | array     |
  | metadata    | type    | object    |
  | deleted_at  | type    | null      |
  | optional    | type    | undefined |
```

**Short form:**

```gherkin
Then json response should match
  | expression          |
  | id #= number        |
  | username #= string  |
  | active #= boolean   |
  | tags #= array       |
  | metadata #= object  |
```

**Available types:**

- `string`
- `number`
- `boolean`
- `array`
- `object`
- `null`
- `undefined`

## Relative Date Matcher

Compare dates relative to current time:

```gherkin
Then json response should match
  | field      | matcher           | value                          |
  | created_at | equalRelativeDate | 0,days,en,YYYY-MM-DD           |
  | expires_at | equalRelativeDate | 7,days,en,YYYY-MM-DD           |
  | updated_at | equalRelativeDate | -1,hours,en,YYYY-MM-DD HH:mm   |
  | starts_at  | equalRelativeDate | 30,minutes,en,HH:mm            |
```

**Format:** `amount,unit,locale,format`

**Parameters:**

- **amount**: Number (positive = future, negative = past, 0 = now)
- **unit**: `seconds`, `minutes`, `hours`, `days`, `weeks`, `months`, `years`
- **locale**: Locale code (`en`, `fr`, `de`, etc.)
- **format**: Date format string

**Examples:**

```gherkin
# Today's date
| created_at | equalRelativeDate | 0,days,en,YYYY-MM-DD |

# Tomorrow
| scheduled_for | equalRelativeDate | 1,days,en,YYYY-MM-DD |

# One week ago
| archived_at | equalRelativeDate | -7,days,en,YYYY-MM-DD |

# Current hour
| timestamp | equalRelativeDate | 0,hours,en,YYYY-MM-DD HH |

# French locale with custom format
| date_fr | equalRelativeDate | 0,days,fr,DD/MM/YYYY |
```

## Negation

**All matchers can be negated!**

Negation keywords:

- `!`
- `not`
- `does not`
- `doesn't`
- `is not`
- `isn't`

### Examples

```gherkin
Then json response should match
  | field    | matcher         | value      |
  | username | not equal       | admin      |
  | email    | !contain        | @test.com  |
  | status   | does not equal  | inactive   |
  | role     | doesn't contain | guest      |
  | active   | is not          | false      |
  | verified | isn't equal     | false      |
```

**Short form with negation:**

```gherkin
Then json response should match
  | expression              |
  | username != admin       |
  | email !*= @test.com     |
  | status != inactive      |
```

## Nested Properties

Use dot notation for nested objects:

```gherkin
Then json response should match
  | field                    | matcher | value     |
  | user.profile.name        | equal   | John      |
  | user.profile.age         | type    | number    |
  | user.settings.theme      | equal   | dark      |
  | address.country.code     | equal   | US        |
  | metadata.created.by      | defined |           |
```

## Array Properties

### Specific Index

```gherkin
Then json response should match
  | field      | matcher | value |
  | users[0].id | type   | number |
  | users[0].name | equal | John |
  | tags[2]    | equal   | api   |
```

### Any Element

Use wildcard `*` to match any element:

```gherkin
Then json response should match
  | field          | matcher | value  |
  | users[*].id    | type    | number |
  | users[*].email | contain | @      |
  | tags[*]        | type    | string |
```

This validates that **all** elements match the condition.

## Complex Examples

### User API Response

```gherkin
Scenario: Validate user response
  When I GET /api/users/1
  Then json response should match
    | expression                         |
    | id #= number                       |
    | username ~= ^[a-z0-9_]+$           |
    | email ~= ^[^@]+@[^@]+\.[^@]+$      |
    | profile.bio ?                      |
    | profile.avatar_url ^= https://     |
    | settings.notifications = true      |
    | settings.theme *= dark             |
    | created_at ~= ^\d{4}-\d{2}-\d{2}   |
    | roles[*] #= string                 |
    | metadata != null                   |
```

### E-Commerce Order

```gherkin
Scenario: Validate order response
  When I POST /api/orders
  Then json response should match
    | field                     | matcher | value     |
    | order_id                  | type    | number    |
    | status                    | equal   | pending   |
    | customer.email            | contain | @         |
    | items[*].product_id       | type    | number    |
    | items[*].quantity         | type    | number    |
    | items[*].price            | type    | number    |
    | shipping.method           | contain | express   |
    | shipping.address.country  | equal   | US        |
    | payment.status            | equal   | authorized |
    | total                     | type    | number    |
    | created_at                | defined |           |
```

### GitHub API

```gherkin
Scenario: Validate GitHub API response
  When I GET https://api.github.com/
  Then json response should match
    | expression                          |
    | current_user_url ^= https://api     |
    | emojis_url ^= https://api           |
    | user_url ~= \{\/user\}$             |
    | rate_limit_url ?                    |
```

## Full vs Partial Match

### Partial Match (Default)

Extra fields are ignored:

```gherkin
# Only validates specified fields
Then json response should match
  | field    | matcher | value   |
  | username | equal   | johndoe |
  | email    | defined |         |

# Response can have other fields like: id, created_at, etc.
```

### Full Match

All response fields must be specified:

```gherkin
# Must specify ALL fields
Then json response should fully match
  | field      | matcher | value   |
  | id         | type    | number  |
  | username   | equal   | johndoe |
  | email      | defined |         |
  | created_at | defined |         |
# Any extra fields will cause failure
```

## Matcher Combinations

Combine multiple matchers for comprehensive validation:

```gherkin
Scenario: Complete validation
  When I GET /api/users/1
  Then json response should match
    # Type checks
    | id #= number |
    | username #= string |
    | age #= number |

    # Existence checks
    | email ? |
    | profile.bio ? |

    # Pattern matching
    | email ~= ^[^@]+@[^@]+$ |
    | phone ~= ^\+?[0-9]{10,}$ |

    # Value checks
    | status = active |
    | role != admin |

    # Substring checks
    | bio *= engineer |
    | url ^= https:// |
```

## Performance Tips

1. **Use type matcher for dynamic values:**

```gherkin
# Instead of
| id ~= ^[0-9]+$ |

# Use
| id #= number |
```

2. **Prefer exact match when possible:**

```gherkin
# Better performance
| status = active |

# Slower
| status ~= ^active$ |
```

3. **Use partial match by default:**

```gherkin
# Faster - only checks needed fields
Then json response should match

# Slower - checks all fields
Then json response should fully match
```

## Common Patterns

### API Contract Validation

```gherkin
# Ensure required fields exist with correct types
Then json response should match
  | id #= number |
  | name #= string |
  | email ~= ^[^@]+@[^@]+$ |
  | created_at ~= ^\d{4}-\d{2}-\d{2}T |
```

### Ignore Dynamic Fields

```gherkin
# Check types for fields that change
Then json response should match
  | id #= number |
  | created_at #= string |
  | updated_at #= string |
  # Exact values for stable fields
  | username = johndoe |
  | role = user |
```

### List Validation

```gherkin
# All items must match
Then json response should match
  | [*].id #= number |
  | [*].name #= string |
  | [*].active #= boolean |
```

## Troubleshooting

### Matcher Not Working

**Problem:** Matcher doesn't validate as expected

**Solutions:**

1. Check field path (use dot notation correctly)
2. Verify value type matches matcher
3. Use dump to see actual response:

```gherkin
When I dump response body
Then json response should match ...
```

### Regex Issues

**Problem:** Regex doesn't match

**Solution:** Test regex separately, escape special characters:

```gherkin
# Wrong
| url ~= https://example.com |

# Correct (escaped dots)
| url ~= https://example\.com |
```

### Type Mismatch

**Problem:** Type matcher fails

**Solution:** Check actual type in response:

```gherkin
When I dump response body
# Look at actual value type, then adjust
```

## Next Steps

- [Type System](/advanced/type-system) - Learn about data types
- [HTTP API Extension](/extensions/http-api) - Use matchers in API tests
- [Snapshot Testing](/extensions/snapshot) - Alternative validation approach
