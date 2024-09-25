import axios from "axios";

/**
 * SurrealDB class handles the http connection and querying of a SurrealDB database.
 */
export default class SurrealDB {
    constructor(config) {
        this.url = config.url;
        this.version = config.version ?? ">= 2.x";
        this.namespace = config.namespace;
        this.database = config.database;
        this.auth = config.auth;
    }

    setRequest(url, method, body) {
        const headers = {
            Accept: "application/json",
        };

        if (this.version === "1.x <=") {
            headers.NS = this.namespace;
            headers.DB = this.database;
        }
        else {
            headers["surreal-ns"] = this.namespace;
            headers["surreal-db"] = this.database;
        }

        if (this.auth) {
            if (this.auth.method === "Root") {
                headers.Authorization = "Basic " + Buffer
                    .from(`${this.auth.vars.username}:${this.auth.vars.password}`, 'utf-8')
                    .toString('base64');

                if (this.auth.vars.namespace !== undefined) headers.NS = this.auth.vars.namespace;
                if (this.auth.vars.database !== undefined) headers.DB = this.auth.vars.database;
            }
            else if (this.auth.method === "Token") {
                headers.Authorization = `Bearer ${this.auth.token}`;
            }
            else if (this.auth.method === "Scope") {
                headers.SC = this.auth.scope;
                Object.entries(this.auth.vars).forEach(([key, value]) => {
                    headers[key] = value;
                });
            }
        }

        return { method, url, data: body, headers };
    }

    async processRequest(config) {
        try {
            const response = await axios.request(config);
            return [response.data, null];
        } catch (error) {
            return [{ result: null, status: "ERR", time: "0ms" }, error?.response?.data];
        };
    }

    async query(sql, vars) {
        let query_url = `${this.url}/sql`;
        const query_vars = new URLSearchParams();

        if (vars) {
            Object.entries(vars).forEach(([key, value]) => {
                if (value !== null) {
                    query_vars.append(key, value.toString());
                }
            });
        }

        if (query_vars.toString()) {
            query_url += `?${query_vars.toString()}`;
        }

        const reqConfig = this.setRequest(query_url, "post", sql);
        const res = await this.processRequest(reqConfig);
        return res;
    }

    authenticate(auth) {
        this.auth = auth;
    }

    invalidate() {
        this.auth = undefined;
    }
}
