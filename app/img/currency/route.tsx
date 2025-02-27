import { ImageResponse } from "@/utils/ImageResponse";
import { loadFonts } from "@/utils/font";
import { BotBank } from "@/utils/bot-bank";
import { CryptoCompare } from "@/utils/cryptocompare";

import Error from "@/app/components/Error";

const IMG_WIDTH = 960;
const IMG_HEIGHT = 540;

export async function GET() {
  try {
    const botBank = new BotBank();
    const cryptoCompare = new CryptoCompare();

    const date = new Date();
    const currentDate = date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    const currentTime = date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const [ratesData, btcData] = await Promise.all([
      botBank.getExchangeRates(),
      cryptoCompare.getDetailedPrice("BTC"),
    ]);
    const JPYData = ratesData.filter((x) => x.currency === "JPY")[0];
    const USDData = ratesData.filter((x) => x.currency === "USD")[0];
    const HKDData = ratesData.filter((x) => x.currency === "HKD")[0];
    const AUDData = ratesData.filter((x) => x.currency === "AUD")[0];

    const greeting =
      date.getHours() < 6
        ? "晚安！"
        : date.getHours() < 12
          ? "早安！"
          : date.getHours() < 18
            ? "午安！"
            : "晚安！";

    return ImageResponse(
      <div
        tw="flex flex-col bg-white p-2 text-xl"
        lang="zh-TW"
        style={{
          width: IMG_WIDTH,
          height: IMG_HEIGHT,
        }}
      >
        <div tw="flex w-full items-center justify-between">
          <div tw="flex">
            <div tw="mr-1 flex rounded-md border-2 border-gray-100 px-2 py-1">
              <span tw="mr-1 opacity-50">AUD</span> $
              {AUDData.spotSell
                ? AUDData.spotSell.toLocaleString("zh-TW", {
                    maximumFractionDigits: 2,
                  })
                : "Error"}
            </div>
            <div tw="mr-1 flex rounded-md border-2 border-gray-100 px-2 py-1">
              <span tw="mr-1 opacity-50">HKD</span> $
              {HKDData.spotSell
                ? HKDData.spotSell.toLocaleString("zh-TW", {
                    maximumFractionDigits: 2,
                  })
                : "Error"}
            </div>
          </div>
          <div tw="flex items-center">
            <div tw="mr-2 opacity-50">{currentDate}</div>
            <div tw="rounded-full border-2 border-black bg-black px-2 text-xl text-white">
              {currentTime}
            </div>
          </div>
        </div>

        <div tw="flex w-full flex-1 items-end justify-between">
          <h2 tw="flex text-left text-6xl font-bold tracking-tight text-gray-900">
            {greeting}
          </h2>
          <div tw="flex">
            <img
              width="384"
              height="330"
              src="https://skog-einvoice.gnehs.net/djungelskog.png"
            />
          </div>
        </div>

        <div tw="flex w-full justify-between">
          <div tw="flex w-[32.5%] flex-col rounded-md bg-gray-100 p-2 shadow">
            <div tw="flex justify-between">
              <div>BTC</div>
              <div tw="flex">
                {btcData.RAW.BTC.USD.CHANGEPCT24HOUR.toFixed(2)}%
              </div>
            </div>
            <div tw="flex items-end">
              <div tw="text-4xl font-bold">
                {btcData.RAW.BTC.USD.PRICE.toLocaleString("zh-TW", {
                  maximumFractionDigits: 0,
                })}
              </div>
              <div tw="ml-1 opacity-50">USD</div>
            </div>
          </div>
          <div tw="flex w-[32.5%] flex-col rounded-md bg-gray-100 p-2 shadow">
            <div tw="flex justify-between">
              <div>JPY/TWD</div>
              <div tw="flex opacity-50">台灣銀行賣出</div>
            </div>
            <div tw="flex items-end">
              <div tw="flex text-4xl font-bold">
                {JPYData.spotSell ?? "Error"}
              </div>
              <div tw="ml-1 opacity-50">TWD</div>
            </div>
          </div>
          <div tw="flex w-[32.5%] flex-col rounded-md bg-gray-100 p-2 shadow">
            <div tw="flex justify-between">
              <div>USD/TWD</div>
              <div tw="flex opacity-50">台灣銀行賣出</div>
            </div>
            <div tw="flex items-end">
              <div tw="flex text-4xl font-bold">
                {USDData.spotSell ?? "Error"}
              </div>
              <div tw="ml-1 opacity-50">TWD</div>
            </div>
          </div>
        </div>
      </div>,
      {
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        //@ts-expect-error loadGoogleFonts is not typed
        fonts: await loadFonts(currentTime + currentDate),
        emoji: "blobmoji",
      },
    );
  } catch (e) {
    return ImageResponse(<Error error={e as Error} width={IMG_WIDTH} />, {
      width: IMG_WIDTH,
      height: IMG_HEIGHT,
      //@ts-expect-error loadGoogleFonts is not typed
      fonts: await loadFonts(),
    });
  }
}
