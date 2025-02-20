import { ImageResponse } from "next/og";
import { HomeAssistant } from "@/utils/homeAssistant";
import { StepStep } from "@/utils/stepStep";
import { CryptoCompare } from "@/utils/cryptocompare";
import { BotBank } from "@/utils/bot-bank";
// 創建實例
const ha = new HomeAssistant(
  process.env.HOME_ASSISTANT_HOST!, // Home Assistant 的網址
  process.env.HOME_ASSISTANT_TOKEN!, // 你的 Access Token
);
const stepStep = new StepStep(
  process.env.STEPSTEP_HOST!, // StepStep 的網址
  process.env.STEPSTEP_TOKEN!, // 你的 Access Token
);
const cryptoCompare = new CryptoCompare();
const botBank = new BotBank();

export async function GET() {
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

  const [
    tempState,
    humidityState,
    occupancyState,
    weatherState,
    deskPowerState,
    closetPowerStateUpper,
    closetPowerStateDown,
    playerState,
    analyticsData,
    btcData,
    ratesData,
  ] = await Promise.all([
    ha.getState("sensor.ble_temperature_gnehs_temp"),
    ha.getState("sensor.ble_humidity_gnehs_temp"),
    ha.getState("binary_sensor.unknown_occupancy"),
    ha.getState("weather.yong_he_bao_bao"),
    ha.getState("sensor.tasmota_energy_power_7"),
    ha.getState("sensor.tasmota_energy_power"),
    ha.getState("sensor.tasmota_energy_power_5"),
    ha.getState("media_player.mi_mao_mi_mao"),
    stepStep.getAnalytics(),
    cryptoCompare.getDetailedPrice("BTC"),
    botBank.getExchangeRates(),
  ]);
  const JPYData = ratesData.filter((x) => x.currency === "JPY")[0];
  console.log(JPYData);

  const greeting =
    date.getHours() < 6
      ? "晚安！"
      : date.getHours() < 12
        ? "早安！"
        : date.getHours() < 18
          ? "午安！"
          : "晚安！";
  return new ImageResponse(
    (
      <div
        tw="flex h-[540px] w-[960px] flex-col bg-white p-2 text-xl"
        lang="zh-TW"
      >
        <div tw="flex w-full items-center justify-between">
          <div tw="flex">
            <div tw="mr-1 flex rounded-md border-2 border-gray-100 px-2 py-1">
              🌡️ {parseFloat(tempState.state).toFixed(1)}
              {tempState.attributes.unit_of_measurement}
            </div>
            <div tw="mr-1 flex rounded-md border-2 border-gray-100 px-2 py-1">
              💧 {parseFloat(humidityState.state).toFixed(0)}
              {humidityState.attributes.unit_of_measurement}
            </div>
            {occupancyState.state === "on" && (
              <div tw="mr-1 flex rounded-md border-2 border-gray-100 px-2 py-1">
                👤 已偵測
              </div>
            )}
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
            <span>{greeting}</span>
            <span tw="opacity-50">勝勝</span>
          </h2>
          <div tw="flex">
            <img
              width="256"
              height="220"
              src="https://skog-einvoice.gnehs.net/djungelskog.png"
            />
          </div>
        </div>

        <div tw="mb-2 flex w-full items-center justify-between rounded-md bg-gray-100 p-2 px-4">
          <div tw="flex text-3xl">☁️ {weatherState.state}</div>
          <div tw="flex text-2xl">
            {weatherState.attributes.temperature}
            {weatherState.attributes.temperature_unit}
          </div>
        </div>

        {playerState.state === "playing" && (
          <div tw="mb-2 flex w-full items-center rounded-md bg-gray-100 p-2 px-4">
            <div tw="text-3xl">🎵</div>
            <div tw="ml-4 flex flex-col">
              <div tw="text-2xl">
                {playerState.attributes.media_title.slice(0, 50)}
              </div>
              <div tw="opacity-50">
                {playerState.attributes.media_artist.slice(0, 50)}
              </div>
            </div>
          </div>
        )}
        <div tw="flex w-full justify-between">
          <div tw="flex w-[32.5%] flex-col rounded-md bg-gray-100 p-2 shadow">
            <div tw="flex justify-between">
              <div>勝勝房間</div>
              <div>⚡️</div>
            </div>
            <div tw="flex items-center">
              <div tw="mr-2 flex items-end">
                <div tw="flex text-4xl font-bold">
                  {parseFloat(closetPowerStateUpper.state) +
                    parseFloat(closetPowerStateDown.state) +
                    parseFloat(deskPowerState.state)}
                </div>
                <div tw="ml-1 flex">
                  {deskPowerState.attributes.unit_of_measurement}
                </div>
              </div>
            </div>
            <div tw="mt-2 flex">
              <MiniCard
                title="衣櫃上"
                value={parseFloat(closetPowerStateUpper.state)}
                unit={closetPowerStateUpper.attributes.unit_of_measurement}
              />
              <MiniCard
                title="衣櫃下"
                value={parseFloat(closetPowerStateDown.state)}
                unit={closetPowerStateDown.attributes.unit_of_measurement}
              />
              <MiniCard
                title="書桌"
                value={parseFloat(deskPowerState.state)}
                unit={deskPowerState.attributes.unit_of_measurement}
              />
            </div>
          </div>
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
            <div tw="mt-1 flex justify-between">
              <div>JPY/TWD</div>
              <div tw="flex opacity-50">台銀賣出</div>
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
              <div>餅餅踏踏</div>
              <div>🚶</div>
            </div>
            <div tw="flex items-end">
              <div tw="flex text-4xl font-bold">
                {"steps" in analyticsData.data.last30dByDay[0]
                  ? analyticsData.data.last30dByDay[0].steps.toLocaleString()
                  : 0}
              </div>
              <div tw="ml-1 opacity-50">步</div>
            </div>
            <div tw="mt-2 flex">
              <MiniCard
                title="距離"
                value={
                  "distance" in analyticsData.data.last30dByDay[0]
                    ? analyticsData.data.last30dByDay[0].distance
                    : 0
                }
                unit="公里"
              />
              <MiniCard
                title="月均步數"
                value={analyticsData.data.aggregate._avg.steps * 24}
                unit="步"
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 960,
      height: 540,
      emoji: "blobmoji",
    },
  );
}

function MiniCard({
  title,
  value,
  unit,
}: {
  title: string;
  value: number;
  unit: string;
}) {
  return (
    <div tw="mr-2 flex flex-col rounded bg-white px-3 py-1 shadow">
      <div tw="flex items-end text-2xl">
        {value.toLocaleString("zh-TW", { maximumFractionDigits: 1 })}
        <div tw="ml-1 text-base opacity-50">{unit}</div>
      </div>
      <div tw="text-base opacity-50">{title}</div>
    </div>
  );
}
