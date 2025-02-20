import { z } from "zod";

// Types for StepStep API responses

const HourlyData = z.record(
  z.string(),
  z.object({
    distance: z.number(),
    energy: z.number(),
    steps: z.number(),
  }),
);

const Last30dAggregate = z.object({
  日: HourlyData,
  一: HourlyData,
  二: HourlyData,
  三: HourlyData,
  四: HourlyData,
  五: HourlyData,
  六: HourlyData,
});

const AnalyticsResponse = z.object({
  success: z.boolean(),
  data: z.object({
    aggregate: z.object({
      _sum: z.object({
        distance: z.number(),
        energy: z.number(),
        steps: z.number(),
      }),
      _avg: z.object({
        distance: z.number(),
        energy: z.number(),
        steps: z.number(),
      }),
    }),
    last30dAggregate: Last30dAggregate,
    last30dByDay: z.array(
      z.union([
        z.object({
          distance: z.number(),
          energy: z.number(),
          steps: z.number(),
          timestamp: z.string(),
        }),
        z.object({
          timestamp: z.string(),
        }),
      ]),
    ),
  }),
});

export class StepStep {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    // Remove trailing slash if present
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(
        `StepStep API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  /**
   * Get analytics data
   */
  async getAnalytics() {
    const data = await this.request<z.infer<typeof AnalyticsResponse>>(
      `/analytics?token=${this.token}`,
    );
    console.log(data);
    return AnalyticsResponse.parse(data);
  }
}
