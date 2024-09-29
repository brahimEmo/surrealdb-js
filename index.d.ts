/// <reference types="node" />

/**
 * Represents the credentials for root-based authentication.
 */
type AuthRoot = {
    method: "Root";
    vars: {
        namespace?: string;
        database?: string;
        username: string;
        password: string;
    };
};

/**
 * Represents the token-based authentication.
 */
type AuthToken = {
    method: "Token";
    token: string;
};

/**
 * Represents scope-based authentication.
 */
type AuthScope = {
    method: "Scope";
    scope: string;
    vars: Record<string, any>;
};

/**
 * Union type representing all possible authentication methods.
 */
type AuthType = AuthRoot | AuthToken | AuthScope;

/**
 * Type representing all valid HTTP methods.
 */
type HTTPMethod = "post" | "get" | "put" | "delete" | "patch" | "head" | "option";

/**
 * Represents the structure of a successful or error request result.
 */
type RequestResult<T> = {
    result: T;
    status: "OK" | "ERR";
    time: string;
};

/**
 * Represents the structure of an error response from surrealDB.
 */
type ErrorResponse = string;

/**
 * Configuration options for initializing the SurrealDB class.
 */
type SurrealDBConfig = {
    url: string;
    version?: "1.x <=" | ">= 2.x";
    namespace: string;
    database: string;
    auth?: AuthType;
};

/**
 * Represents the result type of a query, which could be a successful result or an error response.
 */
type QueryResult<T> = (
    [
        RequestResult<T>[],
        null
    ] | [
        RequestResult<null>,
        ErrorResponse
    ]
);

/**
 * SurrealDB class handles the http connection and querying of a SurrealDB database.
 */
export default class SurrealDB {
    private url: string;
    private version: "1.x <=" | ">= 2.x";
    private auth: AuthType | undefined;
    private namespace: string;
    private database: string;

    constructor(config: SurrealDBConfig);
    private setRequest(url: string, method: HTTPMethod, body: string | object): any;
    private processRequest<T = any[]>(config: any): Promise<[RequestResult<T>[], null] | [RequestResult<null>, string]>;
    query<T = any[]>(sql: string, vars?: Record<string, string | number | null>): Promise<QueryResult<T>>;
    authenticate(auth: AuthType): void;
    invalidate(): void;
}