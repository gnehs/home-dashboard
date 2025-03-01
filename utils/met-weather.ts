import { z } from "zod";

// Types for MET API responses
const WeatherForecastResponse = z.object({
  properties: z.object({
    timeseries: z.array(
      z.object({
        time: z.string(),
        data: z.object({
          instant: z.object({
            details: z.object({
              air_temperature: z.number(),
              relative_humidity: z.number(),
              wind_speed: z.number(),
              wind_from_direction: z.number(),
              air_pressure_at_sea_level: z.number(),
            }),
          }),
          next_1_hours: z
            .object({
              summary: z.object({
                symbol_code: z.string(),
              }),
              details: z.object({
                precipitation_amount: z.number(),
              }),
            })
            .optional(),
        }),
      }),
    ),
  }),
});

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>;
  private readonly TTL: number;

  constructor(ttlSeconds: number = 1800) {
    // 預設 30 分鐘
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
export class MetWeather {
  private baseUrl: string;
  private cache: MemoryCache;

  constructor() {
    this.baseUrl = "https://api.met.no/weatherapi/locationforecast/2.0/compact";
    this.cache = new MemoryCache(1800); // 30 分鐘快取
  }

  private async request(
    latitude: number | string,
    longitude: number | string,
  ): Promise<any> {
    const url = new URL(this.baseUrl);
    url.searchParams.append("lat", latitude.toString());
    url.searchParams.append("lon", longitude.toString());

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "home-dashboard/1.0 https://github.com/gnehs/home-dashboard",
      },
    });

    if (!response.ok) {
      throw new Error(
        `MET API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  /**
   * Get weather forecast for a specific location
   * @param latitude Latitude of the location
   * @param longitude Longitude of the location
   */
  async getForecast(latitude: number | string, longitude: number | string) {
    const cacheKey = `forecast_${latitude}_${longitude}`;
    const cachedData =
      this.cache.get<z.infer<typeof WeatherForecastResponse>>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const data = await this.request(latitude, longitude);
    const parsedData = WeatherForecastResponse.parse(data);
    this.cache.set(cacheKey, parsedData);
    return parsedData;
  }
}
export const WeatherStates = {
  snowshowersandthunder_polartwilight: "極光雷陣雨",
  clearsky: "晴",
  clearsky_day: "晴",
  clearsky_night: "晴",
  clearsky_polartwilight: "極光",
  cloudy: "陰天",
  fair_day: "陰",
  fair_night: "陰",
  fair_polartwilight: "極光",
  fog: "霧",
  heavyrain: "大雨",
  heavyrainandthunder: "雷雨",
  heavyrainshowers_day: "大陣雨",
  heavyrainshowers_night: "大陣雨",
  heavyrainshowers_polartwilight: "大雨陣雨極光",
  heavyrainshowersandthunder_day: "大雷震雨",
  heavyrainshowersandthunder_night: "大雷震雨",
  heavyrainshowersandthunder_polartwilight: "大雷震雨",
  heavysleet: "大冰雹",
  heavysleetandthunder: "大冰雹雷擊",
  heavysleetshowers_day: "大冰雹陣雨白天",
  heavysleetshowers_night: "大冰雹陣雨夜晚",
  heavysleetshowers_polartwilight: "大冰雹陣雨極光",
  heavysleetshowersandthunder_day: "大冰雹雷擊陣雨白天",
  heavysleetshowersandthunder_night: "大冰雹雷擊陣雨夜晚",
  heavysleetshowersandthunder_polartwilight: "大冰雹雷擊陣雨極光",
  heavysnow: "大雪",
  heavysnowandthunder: "大雪雷擊",
  heavysnowshowers_day: "大雪陣雪白天",
  heavysnowshowers_night: "大雪陣雪夜晚",
  heavysnowshowers_polartwilight: "大雪陣雪極光",
  heavysnowshowersandthunder_day: "大雪雷擊陣雪白天",
  heavysnowshowersandthunder_night: "大雪雷擊陣雪夜晚",
  heavysnowshowersandthunder_polartwilight: "大雪雷擊陣雪極光",
  lightrain: "小雨",
  lightrainandthunder: "小雷雨",
  lightrainshowers_day: "小陣雨",
  lightrainshowers_night: "小陣雨",
  lightrainshowers_polartwilight: "小雨陣雨極光",
  lightrainshowersandthunder_day: "小雷陣雨",
  lightrainshowersandthunder_night: "小雷陣雨",
  lightrainshowersandthunder_polartwilight: "小雨雷擊陣雨極光",
  lightsleet: "小冰雹",
  lightsleetandthunder: "小冰雹雷擊",
  lightsleetshowers_day: "小冰雹陣雨白天",
  lightsleetshowers_night: "小冰雹陣雨夜晚",
  lightsleetshowers_polartwilight: "小冰雹陣雨極光",
  lightsnow: "小雪",
  lightsnowandthunder: "小雪雷擊",
  lightsnowshowers_day: "小雪陣雪白天",
  lightsnowshowers_night: "小雪陣雪夜晚",
  lightsnowshowers_polartwilight: "小雪陣雪極光",
  lightssleetshowersandthunder_day: "小冰雹雷擊陣雨白天",
  lightssleetshowersandthunder_night: "小冰雹雷擊陣雨夜晚",
  lightssleetshowersandthunder_polartwilight: "小冰雹雷擊陣雨極光",
  lightssnowshowersandthunder_day: "小雪雷擊陣雪白天",
  lightssnowshowersandthunder_night: "小雪雷擊陣雪夜晚",
  lightssnowshowersandthunder_polartwilight: "小雪雷擊陣雪極光",
  partlycloudy: "多雲",
  partlycloudy_day: "多雲",
  partlycloudy_night: "多雲",
  partlycloudy_polartwilight: "部分多雲極光",
  rain: "雨",
  rainandthunder: "雷雨",
  rainshowers_day: "雨陣雨白天",
  rainshowers_night: "雨陣雨夜晚",
  rainshowers_polartwilight: "雨陣雨極光",
  rainshowersandthunder_day: "雨雷擊陣雨白天",
  rainshowersandthunder_night: "雨雷擊陣雨夜晚",
  rainshowersandthunder_polartwilight: "雨雷擊陣雨極光",
  sleet: "冰雹",
  sleetandthunder: "冰雹雷擊",
  sleetshowers_day: "冰雹陣雨白天",
  sleetshowers_night: "冰雹陣雨夜晚",
  sleetshowers_polartwilight: "冰雹陣雨極光",
  sleetshowersandthunder_day: "冰雹雷擊陣雨白天",
  sleetshowersandthunder_night: "冰雹雷擊陣雨夜晚",
  sleetshowersandthunder_polartwilight: "冰雹雷擊陣雨極光",
  snow: "雪",
  snowandthunder: "雪雷擊",
  snowshowers_day: "雪陣雪白天",
  snowshowers_night: "雪陣雪夜晚",
  snowshowers_polartwilight: "雪陣雪極光",
  snowshowersandthunder_day: "雪雷擊陣雪白天",
  snowshowersandthunder_night: "雪雷擊陣雪夜晚",
};

export function getWeatherIcon(symbol: string) {
  if (symbol.includes("thunder")) return "⚡️";
  if (symbol.includes("rain")) return "🌧️";
  if (symbol.includes("snow")) return "🌨️";
  if (symbol.includes("fog")) return "🌫️";
  if (symbol.includes("cloud")) return "☁️";
  if (symbol.includes("_day")) return "☀️";
  if (symbol.includes("_night")) return "🌙";
  return "☁️";
}
