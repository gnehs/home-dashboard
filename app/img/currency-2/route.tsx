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

    const [ratesData, btcData, ethData] = await Promise.all([
      botBank.getExchangeRates(),
      cryptoCompare.getDetailedPrice("BTC"),
      cryptoCompare.getDetailedPrice("ETH"),
    ]);

    const SGDData = ratesData.filter((x) => x.currency === "SGD")[0];
    const EURData = ratesData.filter((x) => x.currency === "EUR")[0];
    const JPYData = ratesData.filter((x) => x.currency === "JPY")[0];
    const USDData = ratesData.filter((x) => x.currency === "USD")[0];
    const HKDData = ratesData.filter((x) => x.currency === "HKD")[0];
    const AUDData = ratesData.filter((x) => x.currency === "AUD")[0];

    return ImageResponse(
      <div
        tw="flex bg-white text-2xl"
        lang="zh-TW"
        style={{
          width: IMG_WIDTH,
          height: IMG_HEIGHT,
        }}
      >
        <div
          tw="flex flex-col"
          style={{
            width: (IMG_WIDTH / 3) * 2,
            height: IMG_HEIGHT,
          }}
        >
          <div tw="flex flex-col items-center px-2 py-6">
            <div tw="text-8xl">{currentTime}</div>
            <div tw="opacity-50">{currentDate}</div>
          </div>
          <div tw="flex-1"></div>
          <div tw="flex justify-center px-2">
            <img
              width="384"
              height="330"
              src="https://skog-einvoice.gnehs.net/djungelskog.png"
              style={{
                filter: `brightness(150%)`,
              }}
            />
          </div>
        </div>
        <div
          tw="flex flex-col items-center justify-center"
          style={{
            width: IMG_WIDTH / 3,
            height: IMG_HEIGHT,
          }}
        >
          <MiniCurrencyCard currency="AUD" value={AUDData.spotSell} />
          <MiniCurrencyCard currency="HKD" value={HKDData.spotSell} />
          <MiniCurrencyCard currency="SGD" value={SGDData.spotSell} />
          <MiniCurrencyCard currency="EUR" value={EURData.spotSell} />
          <CurrencyCard
            title="BTC"
            subtitle={`${btcData.RAW.BTC.USD.CHANGEPCT24HOUR.toFixed(2)}%`}
            value={btcData.RAW.BTC.USD.PRICE}
            unit="USD"
          />
          <CurrencyCard
            title="ETH"
            subtitle={`${ethData.RAW.ETH.USD.CHANGEPCT24HOUR.toFixed(2)}%`}
            value={ethData.RAW.ETH.USD.PRICE}
            unit="USD"
          />
          <CurrencyCard
            title="JPY/TWD"
            subtitle="台灣銀行賣出"
            value={JPYData.spotSell}
            unit="TWD"
            maximumFractionDigits={4}
          />
          <CurrencyCard
            title="USD/TWD"
            subtitle="台灣銀行賣出"
            value={USDData.spotSell}
            unit="TWD"
          />
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
      emoji: "twemoji",
    });
  }
}

function MiniCurrencyCard({
  currency,
  value,
}: {
  currency: string;
  value: number | null;
}) {
  return (
    <div tw="flex w-full items-center">
      <div tw="h-[80%] w-2 rounded-full bg-black/10" />
      <div
        tw="flex w-full justify-between p-2"
        style={{
          width: IMG_WIDTH / 3 - 8,
        }}
      >
        <span>{currency}</span>
        <span>
          {value
            ? value.toLocaleString("zh-TW", {
                style: "currency",
                currency: "TWD",
              })
            : "Error"}
        </span>
      </div>
    </div>
  );
}
function CurrencyCard({
  title,
  subtitle,
  value,
  unit,
  maximumFractionDigits = 0,
}: {
  title: string;
  subtitle: string;
  value: number | null;
  unit: string;
  maximumFractionDigits?: number;
}) {
  return (
    <div tw="flex w-full items-center">
      <div tw="h-[80%] w-2 rounded-full bg-black/10" />
      <div
        tw="flex w-full flex-col p-2"
        style={{
          width: IMG_WIDTH / 3 - 8,
        }}
      >
        <div tw="flex justify-between text-xl">
          <div>{title}</div>
          <div tw="flex text-xl opacity-50">{subtitle}</div>
        </div>
        <div tw="flex items-end">
          <div tw="flex text-4xl font-bold">
            {value
              ? value.toLocaleString("zh-TW", {
                  maximumFractionDigits,
                })
              : "Error"}
          </div>
          <div tw="ml-1 opacity-50">{unit}</div>
        </div>
      </div>
    </div>
  );
}
