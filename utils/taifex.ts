import { z } from "zod";

// Types for Taifex API responses
const ExchangeRateResponse = z.array(
  z.object({
    date: z.string(),
    usdTwd: z.number(),
    cnyTwd: z.number(),
    eurUsd: z.number(),
    usdJpy: z.number(),
    gbpUsd: z.number(),
    audUsd: z.number(),
    usdHkd: z.number(),
    usdCny: z.number(),
    usdZar: z.number(),
    nzdUsd: z.number(),
  }),
);

export class Taifex {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "https://www.taifex.com.tw/data_gov/taifex_open_data.asp";
  }

  private async request(): Promise<string> {
    const url = new URL(this.baseUrl);
    url.searchParams.append("data_name", "DailyForeignExchangeRates");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Taifex API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.text();
  }

  /**
   * Parse CSV data into structured format
   */
  private parseCSV(csvData: string) {
    const lines = csvData.trim().split("\n");
    // Skip header line
    const dataLines = lines.slice(1);

    return dataLines.map((line) => {
      const [
        date,
        usdTwd,
        cnyTwd,
        eurUsd,
        usdJpy,
        gbpUsd,
        audUsd,
        usdHkd,
        usdCny,
        usdZar,
        nzdUsd,
      ] = line.split(",");

      return {
        date,
        usdTwd: parseFloat(usdTwd),
        cnyTwd: parseFloat(cnyTwd),
        eurUsd: parseFloat(eurUsd),
        usdJpy: parseFloat(usdJpy),
        gbpUsd: parseFloat(gbpUsd),
        audUsd: parseFloat(audUsd),
        usdHkd: parseFloat(usdHkd),
        usdCny: parseFloat(usdCny),
        usdZar: parseFloat(usdZar),
        nzdUsd: parseFloat(nzdUsd),
      };
    });
  }

  /**
   * Get daily foreign exchange rates
   */
  async getExchangeRates() {
    const csvData = await this.request();
    const data = this.parseCSV(csvData);
    return ExchangeRateResponse.parse(data);
  }
}