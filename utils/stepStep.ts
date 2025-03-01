import { z } from "zod";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>;
  private readonly TTL: number;

  constructor(ttlSeconds: number = 600) {
    // 預設 10 分鐘
    this.cache = new Map();
    this.TTL = ttlSeconds * 1000;
  }

  set<T>(key: string, value: T): void {
    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.TTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }
}
// Types for StepStep API responses
const UserResponse = z.object({
  id: z.string(),
  name: z.string(),
});

const RankResponse = z.array(
  z.object({
    steps: z.number(),
    distance: z.number(),
    energy: z.number(),
    user: UserResponse,
  }),
);

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
  private cache: MemoryCache;

  constructor(baseUrl: string, token: string) {
    if (!baseUrl || !token) {
      throw new Error("StepStep - Base URL and token are required");
    }
    if (!baseUrl.startsWith("http")) {
      throw new Error("StepStep - Base URL must start with http or https");
    }
    // Remove trailing slash if present
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.token = token;
    this.cache = new MemoryCache(600); // 10 分鐘快取
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
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
   * Get rank data for a specific date
   * @param date Date in YYYY-MM-DD format
   */
  async getRank(date: string) {
    const cacheKey = `rank_${date}`;
    const cachedData = this.cache.get<z.infer<typeof RankResponse>>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const data = await this.request<z.infer<typeof RankResponse>>(
      `/rank?date=${date}`,
    );
    const parsedData = RankResponse.parse(data);
    this.cache.set(cacheKey, parsedData);
    return parsedData;
  }

  /**
   * Get analytics data
   */
  async getAnalytics() {
    const cacheKey = "analytics";
    const cachedData =
      this.cache.get<z.infer<typeof AnalyticsResponse>>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const data = await this.request<z.infer<typeof AnalyticsResponse>>(
      `/analytics?token=${this.token}`,
    );
    const parsedData = AnalyticsResponse.parse(data);
    this.cache.set(cacheKey, parsedData);
    return parsedData;
  }
}
