import { z } from "zod";

// Types for Home Assistant API responses
const ServiceResponse = z.array(
  z.object({
    domain: z.string(),
    services: z.array(z.string()),
  }),
);

const StateResponse = z.object({
  entity_id: z.string(),
  state: z.string(),
  attributes: z.record(z.any()),
  last_changed: z.string(),
  last_updated: z.string(),
  context: z.object({
    id: z.string(),
    parent_id: z.string().nullable(),
    user_id: z.string().nullable(),
  }),
});

export class HomeAssistant {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    if (!baseUrl || !token) {
      throw new Error("HomeAssistant - Base URL and token are required");
    }
    if (!baseUrl.startsWith("http")) {
      throw new Error("HomeAssistant - Base URL must start with http or https");
    }
    // Remove trailing slash if present
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(
        `Home Assistant API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  /**
   * Get all available services
   */
  async getServices() {
    const data =
      await this.request<z.infer<typeof ServiceResponse>>("/services");
    return ServiceResponse.parse(data);
  }

  /**
   * Get states of all entities
   */
  async getStates() {
    const data = await this.request<z.infer<typeof StateResponse>[]>("/states");
    return z.array(StateResponse).parse(data);
  }

  /**
   * Get state of a specific entity
   */
  async getState(entityId: string) {
    const data = await this.request<z.infer<typeof StateResponse>>(
      `/states/${entityId}`,
    );
    return StateResponse.parse(data);
  }

  /**
   * Set state of an entity
   */
  async setState(
    entityId: string,
    state: string,
    attributes?: Record<string, any>,
  ) {
    const data = await this.request<z.infer<typeof StateResponse>>(
      `/states/${entityId}`,
      {
        method: "POST",
        body: JSON.stringify({ state, attributes }),
      },
    );
    return StateResponse.parse(data);
  }

  /**
   * Call a service
   */
  async callService(
    domain: string,
    service: string,
    serviceData?: Record<string, any>,
  ) {
    return this.request(`/services/${domain}/${service}`, {
      method: "POST",
      body: JSON.stringify(serviceData),
    });
  }

  /**
   * Get camera proxy image
   */
  getCameraProxyUrl(entityId: string) {
    return `${this.baseUrl}/api/camera_proxy/${entityId}`;
  }

  /**
   * Get history for a specific period
   */
  async getHistory(filterEntityId?: string, params?: Record<string, any>) {
    const searchParams = new URLSearchParams();
    if (filterEntityId) {
      searchParams.append("filter_entity_id", filterEntityId);
    }
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, value);
      }
    }

    const endpoint = `/history/period?${searchParams}`;

    return this.request<z.infer<typeof StateResponse>[][]>(endpoint);
  }

  /**
   * Get logbook entries
   */
  async getLogbook(timestamp?: string, entityId?: string) {
    const params = new URLSearchParams();
    if (entityId) {
      params.append("entity", entityId);
    }

    const endpoint = timestamp
      ? `/logbook/${timestamp}?${params}`
      : `/logbook?${params}`;

    return this.request(endpoint);
  }
}
