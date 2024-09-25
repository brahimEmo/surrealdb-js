```markdown
# surrealdb-js

A lightweight and efficient JavaScript client for interacting with SurrealDB databases.  Supports both v1.x and v2.x+.

## Installation

```bash
npm install surrealdb-js
```

## Usage

This package provides a simple interface for querying a SurrealDB database.

### Initialization

First, initialize the `SurrealDB` class with your database configuration:

```typescript
import SurrealDB from 'surrealdb-js';

const db = new SurrealDB({
  url: 'http://localhost:8000', // Or your SurrealDB URL
  version: '>= 2.x', // Specify the SurrealDB version (1.x <= or >= 2.x)
  namespace: 'mynamespace', // Your namespace
  database: 'mydb', // Your database
  auth: { // Authentication details (optional)
    method: 'Root',
    vars: {
      username: 'yourusername',
      password: 'yourpassword'
    }
  }
});
```

Supported authentication methods:

* **`Root`**:  Requires `username` and `password`.  Optionally includes `namespace` and `database`.
* **`Token`**: Requires a `token`.
* **`Scope`**: Requires a `scope` and `vars` (key-value pairs).
* **`Anonymous`**: Auth === undefined.

### Querying the Database

Use the `query` method to execute SQL queries:

```typescript
const [data, error] = await db.query<any[]>(`SELECT * FROM users`);

// Handle the result (see below)
if (error === nil && data[0].status === "OK") {
    console.log(data); // Access the query results
} else {
    console.error(error); // Access the error response
}

//Example with variables
const [data, error] = await db.query<any[]>(`SELECT * FROM users WHERE name = $name;`, {name: 'John Doe'});

//Handle result the same way as before
```

The `query` method returns a `QueryResult` which is a tuple:

`[RequestResult<T>[], ErrorResponse?]`

*   `RequestResult<T>[]`: An array of `RequestResult` objects. Each object contains the query result (`result`), status (`OK` or `ERR`), and timestamp (`time`).  If the query is successful, `result` will contain the data; otherwise, it will be `null`.
*   `ErrorResponse`: If there is an error, this will contain the error message.  If the query is successful, this will be `null`.


### Authentication

To authenticate, use the `authenticate` method:

```typescript
db.authenticate({
  method: 'Token',
  token: 'your-token'
});
```

To invalidate the current authentication, use:

```typescript
db.invalidate();
```

### Error Handling

The `query` method returns a tuple. Check the status to determine success or failure.  Error messages are provided in the second element of the tuple.

## Versioning

Specify the SurrealDB version using the `version` option in the constructor (`1.x <=` or `>= 2.x`).  The default is `>= 2.x`.

## License

MIT
