import { z } from "zod";

// Types for Bank of Taiwan API responses
const ExchangeRateResponse = z.array(
  z.object({
    date: z.string(),
    currency: z.string(),
    cashBuy: z.number().nullable(),
    cashSell: z.number().nullable(),
    spotBuy: z.number().nullable(),
    spotSell: z.number().nullable(),
  })
);

export class BotBank {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "https://rate.bot.com.tw/xrt/flcsv/0/day";
  }

  private async request(): Promise<string> {
    const response = await fetch(this.baseUrl);

    if (!response.ok) {
      throw new Error(
        `Bank of Taiwan API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.text();
  }

  /**
   * Parse CSV response to extract exchange rate data
   */
  private parseCSV(csvData: string) {
    const lines = csvData.trim().split('\n');
    // Skip header line
    const dataLines = lines.slice(1);
    const currentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

    return dataLines.map(line => {
      const values = line.split(',');
      const currency = values[0];
      
      const parseNullableFloat = (value: string) => {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
      };
      
      return {
        date: currentDate,
        currency,
        cashBuy: parseNullableFloat(values[2]),
        cashSell: parseNullableFloat(values[3]),
        spotBuy: parseNullableFloat(values[14]),
        spotSell: parseNullableFloat(values[15]),
      };
    });
  }

  /**
   * Get exchange rates for all currencies
   */
  async getExchangeRates() {
    const csvData = await this.request();
    const data = this.parseCSV(csvData);
    return ExchangeRateResponse.parse(data);
  }
}
