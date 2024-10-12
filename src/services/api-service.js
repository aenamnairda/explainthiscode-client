import { API_BASE_URL, API_VERSION } from "../config";

class ExplainThisCodeClient {
  constructor(config) {
    if (!(this instanceof ExplainThisCodeClient)) {
      return new ExplainThisCodeClient(config);
    }
    this.baseUrl = API_BASE_URL;
    this.apiVersion = API_VERSION;
    this.timeout = config.timeout || 5000;
  }

  async request(method, path, data = null, headers = {}) {
    const url = new URL(`${this.apiVersion}${path}`, this.baseUrl);

    if (method === "GET" && data) {
      Object.keys(data).forEach((key) =>
        url.searchParams.append(key, data[key])
      );
    }

    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || "An error occurred during the request");
    }
  }

  async get(path, params = {}) {
    return this.request("GET", path, params);
  }

  async post(path, data = {}) {
    return this.request("POST", path, data);
  }

  async put(path, data = {}) {
    return this.request("PUT", path, data);
  }

  async delete(path, data = {}) {
    return this.request("DELETE", path, data);
  }
}

const apiClient = new ExplainThisCodeClient({
  timeout: 10000,
});

export { apiClient, ExplainThisCodeClient };

// Export individual methods for convenience
export const getProcess = (processId, params = {}) =>
  apiClient.get(`/processes/${processId}`, params);
// Add other API methods as needed