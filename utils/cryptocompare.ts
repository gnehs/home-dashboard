import { z } from "zod";

// Types for CryptoCompare API responses
const PriceResponse = z.object({
  USD: z.number(),
});

const DetailedPriceResponse = z.object({
  RAW: z.record(z.string(), z.record(z.string(), z.object({
    TYPE: z.string(),
    MARKET: z.string(),
    FROMSYMBOL: z.string(),
    TOSYMBOL: z.string(),
    FLAGS: z.string(),
    LASTMARKET: z.string(),
    MEDIAN: z.number(),
    TOPTIERVOLUME24HOUR: z.number(),
    TOPTIERVOLUME24HOURTO: z.number(),
    LASTTRADEID: z.string(),
    PRICE: z.number(),
    LASTUPDATE: z.number(),
    LASTVOLUME: z.number(),
    LASTVOLUMETO: z.number(),
    VOLUMEHOUR: z.number(),
    VOLUMEHOURTO: z.number(),
    OPENHOUR: z.number(),
    HIGHHOUR: z.number(),
    LOWHOUR: z.number(),
    VOLUMEDAY: z.number(),
    VOLUMEDAYTO: z.number(),
    OPENDAY: z.number(),
    HIGHDAY: z.number(),
    LOWDAY: z.number(),
    VOLUME24HOUR: z.number(),
    VOLUME24HOURTO: z.number(),
    OPEN24HOUR: z.number(),
    HIGH24HOUR: z.number(),
    LOW24HOUR: z.number(),
    CHANGE24HOUR: z.number(),
    CHANGEPCT24HOUR: z.number(),
    CHANGEDAY: z.number(),
    CHANGEPCTDAY: z.number(),
    CHANGEHOUR: z.number(),
    CHANGEPCTHOUR: z.number(),
    CONVERSIONTYPE: z.string(),
    CONVERSIONSYMBOL: z.string(),
    CONVERSIONLASTUPDATE: z.number(),
    SUPPLY: z.number(),
    MKTCAP: z.number(),
    MKTCAPPENALTY: z.number(),
    CIRCULATINGSUPPLY: z.number(),
    CIRCULATINGSUPPLYMKTCAP: z.number(),
    TOTALVOLUME24H: z.number(),
    TOTALVOLUME24HTO: z.number(),
    TOTALTOPTIERVOLUME24H: z.number(),
    TOTALTOPTIERVOLUME24HTO: z.number(),
    IMAGEURL: z.string()
  }))),
  DISPLAY: z.record(z.string(), z.record(z.string(), z.object({
    FROMSYMBOL: z.string(),
    TOSYMBOL: z.string(),
    MARKET: z.string(),
    LASTMARKET: z.string(),
    TOPTIERVOLUME24HOUR: z.string(),
    TOPTIERVOLUME24HOURTO: z.string(),
    LASTTRADEID: z.string(),
    PRICE: z.string(),
    LASTUPDATE: z.string(),
    LASTVOLUME: z.string(),
    LASTVOLUMETO: z.string(),
    VOLUMEHOUR: z.string(),
    VOLUMEHOURTO: z.string(),
    OPENHOUR: z.string(),
    HIGHHOUR: z.string(),
    LOWHOUR: z.string(),
    VOLUMEDAY: z.string(),
    VOLUMEDAYTO: z.string(),
    OPENDAY: z.string(),
    HIGHDAY: z.string(),
    LOWDAY: z.string(),
    VOLUME24HOUR: z.string(),
    VOLUME24HOURTO: z.string(),
    OPEN24HOUR: z.string(),
    HIGH24HOUR: z.string(),
    LOW24HOUR: z.string(),
    CHANGE24HOUR: z.string(),
    CHANGEPCT24HOUR: z.string(),
    CHANGEDAY: z.string(),
    CHANGEPCTDAY: z.string(),
    CHANGEHOUR: z.string(),
    CHANGEPCTHOUR: z.string(),
    CONVERSIONTYPE: z.string(),
    CONVERSIONSYMBOL: z.string(),
    CONVERSIONLASTUPDATE: z.string(),
    SUPPLY: z.string(),
    MKTCAP: z.string(),
    MKTCAPPENALTY: z.string(),
    CIRCULATINGSUPPLY: z.string(),
    CIRCULATINGSUPPLYMKTCAP: z.string(),
    TOTALVOLUME24H: z.string(),
    TOTALVOLUME24HTO: z.string(),
    TOTALTOPTIERVOLUME24H: z.string(),
    TOTALTOPTIERVOLUME24HTO: z.string(),
    IMAGEURL: z.string()
  })))
});

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>;
  private readonly TTL: number;

  constructor(ttlSeconds: number = 300) { // 預設 5 分鐘
    this.cache = new Map();
    this.TTL = ttlSeconds * 1000; // 轉換為毫秒
  }

  set<T>(key: string, value: T): void {
    this.cache.set(key, {
      data: value,
      timestamp: Date.now()
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
export class CryptoCompare {
  private baseUrl: string;
  private detailedBaseUrl: string;
  private cache: MemoryCache;

  constructor() {
    this.baseUrl = "https://min-api.cryptocompare.com/data/price";
    this.detailedBaseUrl = "https://min-api.cryptocompare.com/data/pricemultifull";
    this.cache = new MemoryCache(300); // 5 分鐘快取
  }

  private async request<T>(
    params: Record<string, string>,
    options: RequestInit = {}
  ): Promise<T> {
    const url = new URL(this.baseUrl);
    url.search = new URLSearchParams({
      ...params,
      sign: "true",
      extraParams: "gnehs-home-dashboard",
    }).toString();

    const headers = {
      "Content-Type": "application/json; charset=UTF-8",
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(
        `CryptoCompare API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Get cryptocurrency price in USD
   * @param symbol Cryptocurrency symbol (e.g., "BTC")
   */
   async getPrice(symbol: string) {
     const cacheKey = `price_${symbol}`;
     const cachedData = this.cache.get<z.infer<typeof PriceResponse>>(cacheKey);
     
     if (cachedData) {
       return cachedData;
     }
 
     const data = await this.request<z.infer<typeof PriceResponse>>({
       fsym: symbol,
       tsyms: "USD",
     });
     const parsedData = PriceResponse.parse(data);
     this.cache.set(cacheKey, parsedData);
     return parsedData;
  }

  /**
   * Get detailed cryptocurrency price information in USD
   * @param symbol Cryptocurrency symbol (e.g., "BTC")
   */
   async getDetailedPrice(symbol: string) {
     const cacheKey = `detailed_price_${symbol}`;
     const cachedData = this.cache.get<z.infer<typeof DetailedPriceResponse>>(cacheKey);
     
     if (cachedData) {
       return cachedData;
     }
 
     const url = new URL(this.detailedBaseUrl);
     url.search = new URLSearchParams({
       fsyms: symbol,
       tsyms: "USD",
       sign: "true",
       extraParams: "gnehs-home-dashboard",
     }).toString();
 
     const response = await fetch(url, {
       headers: {
         "Content-Type": "application/json; charset=UTF-8",
       },
     });
 
     if (!response.ok) {
       throw new Error(
         `CryptoCompare API error: ${response.status} ${response.statusText}`
       );
     }
 
     const data = await response.json();
     const parsedData = DetailedPriceResponse.parse(data);
     this.cache.set(cacheKey, parsedData);
     return parsedData;
  }
}