# HTTP API Extension

Test REST APIs with powerful request building, response validation, cookie management, and request chaining.

::: tip Setup Required
Add to your `features/support/world.js`:
```javascript
import { httpApi } from '@ekino/veggies'
httpApi.install({
    baseUrl: 'https://api.example.com' // Optional
})
```
Requires: [State extension](/extensions/state) for placeholders  
See [Getting Started](/guide/getting-started) for full setup instructions.
:::

## Quick Example

```gherkin
Scenario: Create and fetch a user
  Given I set request json body
    | username | johndoe((string))    |
    | age      | 25((number))         |
    | active   | true((boolean))      |
  When I POST https://api.example.com/users
  Then response status code should be 201
  And json response should match
    | field    | matcher | value   |
    | username | equal   | johndoe |
    | id       | defined |         |
  And I pick response json id as userId
  And I GET https://api.example.com/users/{{userId}}
  Then response status code should be 200
```

## Request Building

### HTTP Methods

Make HTTP requests with any standard method:

```gherkin
When I GET https://api.example.com/users
When I POST https://api.example.com/users
When I PUT https://api.example.com/users/123
When I PATCH https://api.example.com/users/123
When I DELETE https://api.example.com/users/123
```

**With base URL:**

```javascript
httpApi.install({ baseUrl: 'https://api.example.com' })
```

```gherkin
When I GET /users              # → https://api.example.com/users
When I POST /users             # → https://api.example.com/users
```

### Setting Headers

**Single header:**

```gherkin
Given I set User-Agent request header to veggies/1.0
Given I set Authorization request header to Bearer {{token}}
Given I set Content-Type request header to application/json
```

**Multiple headers (replaces all):**

```gherkin
Given I set request headers
  | User-Agent    | veggies/1.0           |
  | Authorization | Bearer secret-token   |
  | Accept        | application/json      |
```

**Assign headers (merge with existing):**

```gherkin
Given I assign request headers
  | X-Custom-Header | custom-value |
  | X-Request-ID    | req-123      |
```

**Clear headers:**

```gherkin
Given I clear request headers
```

### Request Body

#### JSON Body

**Inline data:**

```gherkin
Given I set request json body
  | username  | johndoe((string))        |
  | email     | john@example.com         |
  | age       | 25((number))             |
  | active    | true((boolean))          |
  | roles     | admin,user((array))      |
  | metadata  | ((null))                 |
```

**From fixture file:**

```gherkin
# Load from features/fixtures/user.json or user.yaml
Given I set request json body from user
```

#### Form Data

**Inline form data:**

```gherkin
Given I set request form body
  | username | johndoe          |
  | password | secret123        |
  | remember | true((boolean))  |
```

**From fixture file:**

```gherkin
Given I set request form body from login
```

#### Multipart Data

```gherkin
# Load multipart data from fixture
Given I set request multipart body from upload
```

#### Clear Body

```gherkin
Given I clear request body
```

### Query Parameters

```gherkin
Given I set request query
  | page     | 1((number))       |
  | limit    | 10((number))      |
  | sort     | name              |
  | filter   | active            |
```

This generates: `?page=1&limit=10&sort=name&filter=active`

### Redirect Handling

```gherkin
# Follow redirects (default behavior)
Given I follow redirect

# Don't follow redirects
Given I do not follow redirect
```

## Response Validation

### Status Code

**By code number:**

```gherkin
Then response status code should be 200
Then response status code should be 201
Then response status code should be 404
Then response status code should be 500
```

**By status name:**

```gherkin
Then response status should be ok                    # 200
Then response status should be created               # 201
Then response status should be no content            # 204
Then response status should be bad request           # 400
Then response status should be unauthorized          # 401
Then response status should be forbidden             # 403
Then response status should be not found             # 404
Then response status should be internal server error # 500
```

### JSON Response Matching

#### Basic Matching

```gherkin
Then json response should match
  | field           | matcher | value        |
  | username        | equal   | johndoe      |
  | email           | contain | @example.com |
  | age             | type    | number       |
  | roles           | contain | admin        |
  | created_at      | defined |              |
```

#### Shorthand Syntax

```gherkin
Then json response should match
  | expression                    |
  | username    = johndoe         |
  | email       *= example        |
  | age         #= number         |
  | created_at  ?                 |
```

#### Full Match

By default, extra fields are ignored. To require exact match:

```gherkin
Then json response should fully match
  | field    | matcher | value   |
  | username | equal   | johndoe |
  | email    | equal   | john@example.com |
  # Any extra fields will cause failure
```

#### Nested Properties

Use dot notation for nested objects:

```gherkin
Then json response should match
  | field                 | matcher | value  |
  | user.profile.name     | equal   | John   |
  | user.profile.age      | type    | number |
  | address.city          | equal   | Paris  |
  | address.country.code  | equal   | FR     |
```

#### Array Properties

```gherkin
Then json response should match
  | field     | matcher | value |
  | roles[0]  | equal   | admin |
  | roles[1]  | equal   | user  |
  | tags      | contain | api   |
```

### Collection Size

```gherkin
# Check array length at root
Then I should receive a collection of 5 items

# Check nested array length
Then I should receive a collection of 3 items for path users
Then I should receive a collection of 10 items for path data.results
```

### Response Headers

```gherkin
Then response header Content-Type should equal application/json
Then response header Content-Type should contain application/json
Then response header X-API-Version should match ^v[0-9]+
Then response header X-Rate-Limit should not equal 0
Then response header Cache-Control should not contain no-cache
```

## Cookie Management

### Enable/Disable Cookies

```gherkin
Given I enable cookies
# Cookies are now persisted across requests in this scenario

Given I disable cookies
# Cookies are cleared and not stored
```

::: warning Cookie Scope
Cookies are **scenario-scoped** by default. They don't persist across scenarios to ensure test isolation.
:::

### Set Cookies from Fixture

```yaml
# features/fixtures/session-cookie.yaml
name: session_id
value: abc123xyz
domain: example.com
path: /
secure: true
httpOnly: true
```

```gherkin
Given I set cookie from session-cookie
```

### Validate Response Cookies

**Check cookie existence:**

```gherkin
Then response should have a session cookie
Then response should not have a tracking cookie
```

**Check cookie properties:**

```gherkin
Then response session cookie should be secure
Then response session cookie should not be secure
Then response session cookie should be http only
Then response session cookie should not be http only
Then response session cookie domain should be example.com
Then response session cookie domain should not be .tracking.com
```

### Clear Cookies

```gherkin
Given I clear request cookies
```

## Request Chaining

### Extract and Reuse Values

**From JSON response:**

```gherkin
# Extract single value
When I GET https://api.example.com/users/1
And I pick response json id as userId
And I pick response json email as userEmail

# Use in subsequent request
When I GET https://api.example.com/users/{{userId}}/posts
Then response status code should be 200
```

**From response headers:**

```gherkin
When I POST https://api.example.com/users
Then response status code should be 201
And I pick response header location as userLocation
And I GET {{userLocation}}
```

**Complex example with multiple chaining:**

```gherkin
Scenario: Complete user workflow
  # Create user
  Given I set request json body
    | username | johndoe |
  When I POST /users
  Then response status code should be 201
  And I pick response json id as userId

  # Create post for user
  Given I set request json body
    | title   | My First Post        |
    | content | Hello World          |
    | user_id | {{userId}}((number)) |
  When I POST /posts
  Then response status code should be 201
  And I pick response json id as postId

  # Add comment to post
  Given I set request json body
    | text    | Great post!          |
    | post_id | {{postId}}((number)) |
    | user_id | {{userId}}((number)) |
  When I POST /comments
  Then response status code should be 201

  # Fetch everything
  When I GET /users/{{userId}}/posts/{{postId}}/comments
  Then response status code should be 200
```

### Replace Placeholders in State

```gherkin
# Extract URL with placeholder
And I pick response json callback_url as callbackUrl
# callbackUrl = "https://api.example.com/callback/{token}/verify"

# Replace placeholder
And I replace {token} in callbackUrl to abc123

# Now callbackUrl = "https://api.example.com/callback/abc123/verify"
When I GET {{callbackUrl}}
```

**With regex options:**

```gherkin
And I replace placeholder {id} in apiUrl to 123 with regex option g
And I replace {env} in baseUrl to prod with regex option gi
```

## Advanced Matchers

### Matcher Types

| Matcher             | Short | Description        | Example              |
| ------------------- | ----- | ------------------ | -------------------- |
| `equal`             | `=`   | Exact match        | `username = johndoe` |
| `contain`           | `*=`  | Contains substring | `email *= @example`  |
| `match`             | `~=`  | Regex match        | `id ~= ^[0-9]+$`     |
| `start with`        | `^=`  | Starts with        | `url ^= https://`    |
| `end with`          | `$=`  | Ends with          | `file $= .json`      |
| `defined`           | `?`   | Not undefined      | `id ?`               |
| `type`              | `#=`  | Type check         | `age #= number`      |
| `equalRelativeDate` | N/A   | Date comparison    | See below            |

### Negating Matchers

All matchers can be negated:

```gherkin
Then json response should match
  | field    | matcher   | value    |
  | username | not equal | admin    |
  | email    | !contain  | test     |
  | role     | isn't     | guest    |
  | status   | doesn't equal | inactive |
```

Negation keywords: `!`, `not`, `does not`, `doesn't`, `is not`, `isn't`

### Type Checking

```gherkin
Then json response should match
  | field      | matcher | value     |
  | id         | type    | number    |
  | username   | type    | string    |
  | active     | type    | boolean   |
  | tags       | type    | array     |
  | metadata   | type    | object    |
  | deleted_at | type    | null      |
  | optional   | type    | undefined |
```

### Date Matching

```gherkin
# Match date relative to now
Then json response should match
  | field      | matcher           | value                     |
  | created_at | equalRelativeDate | 0,days,en,YYYY-MM-DD      |
  | updated_at | equalRelativeDate | -1,hours,en,YYYY-MM-DD HH |
  | expires_at | equalRelativeDate | 7,days,fr,DD/MM/YYYY      |
```

**Format:** `amount,unit,locale,format`

- **amount**: Number (positive = future, negative = past)
- **unit**: `seconds`, `minutes`, `hours`, `days`, `weeks`, `months`, `years`
- **locale**: Locale code (`en`, `fr`, etc.)
- **format**: Date format string

## Debugging

### Dump Response Data

```gherkin
When I GET https://api.example.com/users
And I dump response body
And I dump response headers
And I dump response cookies
Then response status code should be 200
```

Output:

```json
// Response body
{
  "id": 123,
  "username": "johndoe",
  "email": "john@example.com"
}

// Headers
{
  "content-type": "application/json",
  "x-rate-limit": "100"
}

// Cookies
[
  {
    "name": "session",
    "value": "abc123",
    "secure": true
  }
]
```

## Real-World Examples

### User Registration Flow

```gherkin
Scenario: User registration and login
  # Register
  Given I set request json body
    | username | johndoe          |
    | email    | john@example.com |
    | password | Secret123!       |
  When I POST /api/register
  Then response status code should be 201
  And json response should match
    | field    | matcher | value |
    | id       | defined |       |
    | username | equal   | johndoe |
    | token    | match   | ^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$ |

  # Save token
  And I pick response json token as authToken

  # Use token to fetch profile
  Given I set Authorization request header to Bearer {{authToken}}
  When I GET /api/profile
  Then response status code should be 200
  And json response should match
    | field    | matcher | value        |
    | username | equal   | johndoe      |
    | email    | equal   | john@example.com |
```

### GitHub API Example

```gherkin
Scenario Outline: Fetch different GitHub endpoints
  Given I set User-Agent request header to veggies/1.0
  When I GET https://api.github.com/
  Then response status code should be 200
  And I pick response json <endpoint> as targetUrl
  When I GET {{targetUrl}}
  Then response status code should be 200

  Examples:
    | endpoint         |
    | emojis_url       |
    | feeds_url        |
    | public_gists_url |
```

### E-Commerce Checkout

```gherkin
Scenario: Complete checkout process
  # Add item to cart
  Given I set request json body
    | product_id | 456((number)) |
    | quantity   | 2((number))   |
  When I POST /api/cart
  Then response status code should be 201
  And I pick response json cart_id as cartId

  # Apply coupon
  Given I set request json body
    | coupon_code | SAVE20 |
  When I POST /api/cart/{{cartId}}/coupon
  Then response status code should be 200
  And json response should match
    | field    | matcher | value |
    | discount | type    | number |
    | total    | type    | number |
  And I pick response json total as finalTotal

  # Checkout
  Given I set request json body
    | cart_id         | {{cartId}}((number))    |
    | payment_method  | credit_card             |
    | expected_total  | {{finalTotal}}((number)) |
  When I POST /api/checkout
  Then response status code should be 200
  And json response should match
    | field      | matcher | value  |
    | order_id   | defined |        |
    | status     | equal   | paid   |
```

## Low-Level API

For custom step definitions, access the HTTP client:

```javascript
import { When, Then } from '@cucumber/cucumber'

When('I make a custom request', async function () {
    await this.httpApiClient.makeRequest('POST', '/custom', 'https://api.example.com')
})

Then('I check custom response data', function () {
    const response = this.httpApiClient.getResponse()
    console.log(response.data)
    console.log(response.status)
    console.log(response.headers)
})

// Available methods:
// - setHeader(key, value)
// - setHeaders(headers)
// - clearHeaders()
// - setJsonBody(data)
// - setFormBody(data)
// - setMultipartBody(data)
// - clearBody()
// - setQuery(params)
// - enableCookies()
// - disableCookies()
// - setCookie(cookie)
// - getCookie(name)
// - getCookies()
// - clearRequestCookies()
// - makeRequest(method, url, baseUrl)
// - getResponse()
// - reset()
```

## Configuration Options

```javascript
httpApi.install({
    baseUrl: 'https://api.example.com', // Default base URL
    timeout: 5000, // Request timeout in ms
    headers: {
        // Default headers
        'User-Agent': 'veggies/1.0',
        Accept: 'application/json',
    },
})
```

## Complete Gherkin Reference

### Given Steps

```gherkin
Given I set request headers
Given I do not follow redirect
Given I follow redirect
Given I assign request headers
Given I set {header} request header to {value}
Given I clear request headers
Given I set request json body
Given I set request json body from {fixture}
Given I set request form body
Given I set request form body from {fixture}
Given I set request multipart body from {fixture}
Given I clear request body
Given I set request query
Given I pick response json {path} as {key}
Given I pick response header {header} as {key}
Given I replace {search} in {key} to {value}
Given I replace placeholder {search} in {key} to {value} with regex option {flags}
Given I enable cookies
Given I disable cookies
Given I set cookie from {fixture}
Given I clear request cookies
```

### When Steps

```gherkin
When I reset http client
When I GET {url}
When I POST {url}
When I PUT {url}
When I DELETE {url}
When I PATCH {url}
When I dump response body
When I dump response headers
When I dump response cookies
```

### Then Steps

```gherkin
Then response status code should be {code}
Then response status should be {status}
Then response should have a {name} cookie
Then response should not have a {name} cookie
Then response {name} cookie should be secure
Then response {name} cookie should not be secure
Then response {name} cookie should be http only
Then response {name} cookie should not be http only
Then response {name} cookie domain should be {domain}
Then response {name} cookie domain should not be {domain}
Then json response should match
Then json response should fully match
Then I should receive a collection of {count} items
Then I should receive a collection of {count} items for path {path}
Then response should match fixture {fixture}
Then response header {header} should equal {value}
Then response header {header} should contain {value}
Then response header {header} should match {pattern}
Then response header {header} should not equal {value}
Then response header {header} should not contain {value}
Then response header {header} should not match {pattern}
```

::: tip
All step definitions support the optional "I" prefix for better readability!

Both work:

- `When I GET /users`
- `When GET /users`
  :::

## Next Steps

- [CLI Extension](/extensions/cli) - Test command-line applications
- [Snapshot Extension](/extensions/snapshot) - Add regression testing
- [State Extension](/extensions/state) - Deep dive into state management
