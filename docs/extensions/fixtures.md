# Fixtures Extension

Load test data from external files (YAML, JSON, JavaScript, TXT) to keep scenarios clean and maintainable.

::: tip Setup Required
Add to your `features/support/world.js`:
```javascript
import { fixtures } from '@ekino/veggies'
fixtures.install()
```
No dependencies required.  
See [Getting Started](/guide/getting-started) for full setup instructions.
:::

## Why Fixtures?

Benefits:

- 📝 **Clean scenarios** - No large data blocks in Gherkin
- 🔄 **Reusability** - Share test data across scenarios
- 🎯 **Maintainability** - Update data in one place
- 📦 **Organization** - Group related test data
- 🔧 **Dynamic loading** - Use JavaScript for complex data

## Directory Structure

By default, fixtures are loaded from `features/fixtures/`:

```
features/
├── fixtures/
│   ├── users/
│   │   ├── admin.json
│   │   ├── customer.yaml
│   │   └── guest.js
│   ├── products/
│   │   ├── electronics.json
│   │   └── books.yaml
│   └── common/
│       ├── headers.yaml
│       └── config.txt
├── api/
│   └── users.feature
└── support/
    └── world.js
```

## Supported Formats

### JSON Files (`.json`)

```json
// features/fixtures/users/john.json
{
    "username": "johndoe",
    "email": "john@example.com",
    "age": 25,
    "active": true,
    "roles": ["user", "admin"]
}
```

```gherkin
Given I set request json body from users/john
```

### YAML Files (`.yaml`, `.yml`)

```yaml
# features/fixtures/users/jane.yaml
username: janedoe
email: jane@example.com
age: 28
active: true
roles:
    - user
    - moderator
profile:
    bio: 'Software engineer'
    location: 'San Francisco'
```

```gherkin
Given I set request json body from users/jane
```

### JavaScript Files (`.js`)

For dynamic or computed data:

```javascript
// features/fixtures/users/dynamic.js
export default function () {
    return {
        username: `user_${Date.now()}`,
        email: `test_${Math.random()}@example.com`,
        timestamp: new Date().toISOString(),
        random_id: Math.floor(Math.random() * 1000),
    }
}
```

```gherkin
Given I set request json body from users/dynamic
```

### Text Files (`.txt`)

For plain text content:

```txt
features/fixtures/messages/welcome.txt
Welcome to our API!
This is a multi-line message.
It can contain any text.
```

```gherkin
Given I set request body from messages/welcome
```

## Usage Examples

### With HTTP API

```gherkin
# Load request body
Given I set request json body from users/admin
When I POST /api/users

# Load form data
Given I set request form body from auth/login
When I POST /api/auth/login

# Load multipart data
Given I set request multipart body from uploads/document
When I POST /api/upload
```

### Complex Nested Structure

```yaml
# features/fixtures/api/create-order.yaml
customer:
    id: 123
    email: customer@example.com
items:
    - product_id: 456
      quantity: 2
      price: 29.99
    - product_id: 789
      quantity: 1
      price: 49.99
shipping:
    address:
        street: '123 Main St'
        city: 'San Francisco'
        country: 'US'
    method: 'express'
payment:
    method: 'credit_card'
    token: 'tok_abc123'
```

```gherkin
Given I set request json body from api/create-order
When I POST /api/orders
```

### Using with Cookies

```yaml
# features/fixtures/cookies/session.yaml
name: session_id
value: abc123xyz789
domain: .example.com
path: /
secure: true
httpOnly: true
sameSite: strict
```

```gherkin
Given I set cookie from cookies/session
When I GET /api/protected/resource
```

### Arrays and Lists

```json
// features/fixtures/products/electronics.json
[
    {
        "id": 1,
        "name": "Laptop",
        "price": 999.99
    },
    {
        "id": 2,
        "name": "Mouse",
        "price": 29.99
    }
]
```

## Dynamic Fixtures with JavaScript

### Time-Based Data

```javascript
// features/fixtures/dates/relative.js
export default function () {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return {
        start_date: now.toISOString(),
        end_date: tomorrow.toISOString(),
        created_at: now.toISOString(),
    }
}
```

### Environment-Specific Data

```javascript
// features/fixtures/config/api-urls.js
export default function () {
    const env = process.env.NODE_ENV || 'development'

    const urls = {
        development: 'http://localhost:3000',
        staging: 'https://api.staging.example.com',
        production: 'https://api.example.com',
    }

    return {
        api_url: urls[env],
        environment: env,
    }
}
```

### Faker.js Integration

```javascript
// features/fixtures/users/random.js
import { faker } from '@faker-js/faker'

export default function () {
    return {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone: faker.phone.number(),
        address: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            country: faker.location.country(),
        },
    }
}
```

## Fixture Inheritance

Combine multiple fixtures:

```javascript
// features/fixtures/users/base.json
{
  "role": "user",
  "active": true,
  "verified": false
}
```

```javascript
// features/fixtures/users/admin.js
import base from './base.json'

export default function () {
    return {
        ...base,
        role: 'admin',
        permissions: ['read', 'write', 'delete'],
    }
}
```

## Real-World Examples

### Complete User Management Test

```gherkin
Feature: User Management

  Scenario: Create different user types
    # Admin user
    Given I set request json body from users/admin
    When I POST /api/users
    Then response status code should be 201

    # Regular user
    Given I set request json body from users/regular
    When I POST /api/users
    Then response status code should be 201

    # Guest user
    Given I set request json body from users/guest
    When I POST /api/users
    Then response status code should be 201
```

### Multi-Step Workflow

```gherkin
Scenario: Complete order workflow
  # Step 1: Create user
  Given I set request json body from users/customer
  When I POST /api/users
  And I pick response json id as userId

  # Step 2: Add items to cart
  Given I set request json body from orders/cart-items
  When I POST /api/users/{{userId}}/cart
  And I pick response json cart_id as cartId

  # Step 3: Checkout
  Given I set request json body from orders/checkout
  When I POST /api/carts/{{cartId}}/checkout
  Then response status code should be 200
```

### Testing Different Scenarios

```gherkin
Scenario Outline: Test with different user data
  Given I set request json body from users/<fixture>
  When I POST /api/users
  Then response status code should be <status>

  Examples:
    | fixture      | status |
    | valid-user   | 201    |
    | invalid-user | 400    |
    | admin-user   | 201    |
```

## Fixture Organization Strategies

### By Feature

```
fixtures/
├── authentication/
│   ├── valid-login.yaml
│   ├── invalid-login.yaml
│   └── expired-token.yaml
├── users/
│   ├── create-user.json
│   ├── update-user.json
│   └── delete-user.json
└── products/
    ├── create-product.yaml
    └── update-product.yaml
```

### By Type

```
fixtures/
├── requests/
│   ├── create-user.json
│   ├── update-profile.yaml
│   └── checkout.json
├── responses/
│   ├── user-list.json
│   ├── product-detail.json
│   └── order-summary.json
└── cookies/
    ├── session.yaml
    └── auth.yaml
```

### By Scenario

```
fixtures/
├── user-registration/
│   ├── request.json
│   ├── validation-errors.json
│   └── success-response.json
├── checkout-flow/
│   ├── cart.json
│   ├── payment.yaml
│   └── confirmation.json
```

## Low-Level API

For custom step definitions:

```javascript
import { Given, When } from '@cucumber/cucumber'

Given('I load custom fixture', async function () {
    // Load fixture
    const data = await this.fixtures.load('users/admin')
    console.log(data)

    // Use the data
    this.httpApiClient.setJsonBody(data)
})

When('I process fixture data', async function () {
    const user = await this.fixtures.load('users/john')
    const config = await this.fixtures.load('config/api')

    // Combine or transform data
    const requestBody = {
        ...user,
        api_key: config.api_key,
    }

    this.httpApiClient.setJsonBody(requestBody)
})

// Available methods:
// - load(fixturePath)  // Returns Promise<any>
```

### Custom Fixture Directory

```javascript
// Configure custom directory
fixtures.install({
    fixturesDir: './test-data',
})
```

## Combining Fixtures with State

```gherkin
# Load base fixture
Given I set request json body from users/base

# Override with state values
And I set state userId to 123
And I set state username to dynamic-user

# The fixture is loaded, then placeholders are replaced
# If fixture has {{userId}} or {{username}}, they'll be replaced
```

## Best Practices

### ✅ Do's

- Use descriptive file names
- Group related fixtures in directories
- Keep fixtures simple and focused
- Use JSON/YAML for static data
- Use JavaScript for dynamic/computed data
- Version control all fixtures
- Document complex fixtures

### ❌ Don'ts

- Don't put sensitive data in fixtures (use env vars)
- Don't create huge fixture files
- Don't use fixtures for test configuration
- Don't duplicate data across fixtures unnecessarily

## Common Patterns

### Default + Override Pattern

```javascript
// fixtures/users/defaults.js
export default function () {
    return {
        role: 'user',
        active: true,
        verified: false,
        preferences: {
            theme: 'light',
            notifications: true,
        },
    }
}
```

```gherkin
Given I set request json body from users/defaults
# Override specific fields in scenario
And I set request json body
  | role   | admin((string))       |
  | active | false((boolean))      |
```

### Template Pattern

```yaml
# fixtures/templates/user-template.yaml
username: ${USERNAME}
email: ${EMAIL}
role: user
active: true
```

```javascript
// Custom step to process template
Given('I create user from template with {string} and {string}', async function (username, email) {
    const template = await this.fixtures.load('templates/user-template')
    const data = template.replace('${USERNAME}', username).replace('${EMAIL}', email)

    this.httpApiClient.setJsonBody(JSON.parse(data))
})
```

## Troubleshooting

### Fixture Not Found

**Error:** `Cannot find fixture: users/admin`

**Solutions:**

1. Check file exists at `features/fixtures/users/admin.{json,yaml,js,txt}`
2. Verify fixture directory path
3. Check file extension is supported
4. Ensure fixture file has valid syntax

### Invalid JSON/YAML

**Error:** `Unexpected token in JSON`

**Solutions:**

1. Validate JSON syntax
2. Check for trailing commas (not allowed in JSON)
3. Use a linter (jsonlint, yamllint)
4. Test fixture file in isolation

### Module Export Error

**Error:** `Fixture must export default function`

**Solutions:**

```javascript
// ❌ Wrong
export function getData() { ... }

// ✅ Correct
export default function() { ... }
```

## Next Steps

- [State Extension](/extensions/state) - Combine with dynamic values
- [HTTP API Extension](/extensions/http-api) - Use fixtures in API tests
- [Type System](/advanced/type-system) - Understand data types
