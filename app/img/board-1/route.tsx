import { ImageResponse } from "@/utils/ImageResponse";
import { loadFonts } from "@/utils/font";
import { HomeAssistant } from "@/utils/homeAssistant";
import { StepStep } from "@/utils/stepStep";
import { CryptoCompare } from "@/utils/cryptocompare";
import { BotBank } from "@/utils/bot-bank";
import { WeatherStates, getWeatherIcon } from "@/utils/met-weather";
import Error from "@/app/components/Error";

const IMG_WIDTH = 960;
const IMG_HEIGHT = 540;

type HomeAssistantState = Awaited<ReturnType<HomeAssistant["getState"]>>;

function getAttribute(state: HomeAssistantState, key: string): string {
  const value = state.attributes[key];
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";
}

export async function GET() {
  try {
    const ha = new HomeAssistant(
      process.env.HOME_ASSISTANT_HOST!,
      process.env.HOME_ASSISTANT_TOKEN!,
    );
    const stepStep = new StepStep(
      process.env.STEPSTEP_HOST!,
      process.env.STEPSTEP_TOKEN!,
    );
    const cryptoCompare = new CryptoCompare();
    const botBank = new BotBank();

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
      btcData,
      ratesData,
      analyticsData,
    ] = await Promise.all([
      ha.getState("sensor.ble_temperature_gnehs_temp"),
      ha.getState("sensor.ble_humidity_gnehs_temp"),
      ha.getState("binary_sensor.unknown_occupancy"), // Sonoff SNZB-06P
      ha.getState("weather.yong_he_bao_bao"),
      ha.getState("sensor.tasmota_energy_power_7"), // Sonoff S31 with Tasmota
      ha.getState("sensor.tasmota_energy_power"), // Sonoff S31 with Tasmota
      ha.getState("sensor.tasmota_energy_power_5"), // Sonoff S31 with Tasmota
      ha.getState("media_player.mi_mao_mi_mao"), // HomePod mini
      cryptoCompare.getDetailedPrice("BTC"),
      botBank.getExchangeRates(),
      stepStep.getAnalytics(),
    ]);
    const JPYData = ratesData.filter((x) => x.currency === "JPY")[0];
    const last30dByDay = analyticsData.data.last30dByDay;
    const playerEntityPicture = getAttribute(playerState, "entity_picture");
    const playerMediaTitle = getAttribute(playerState, "media_title");
    const playerMediaArtist = getAttribute(playerState, "media_artist");

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
            <div tw="mr-1 flex rounded-md border-2 border-black/20 px-2 py-1">
              🌡️ {parseFloat(tempState.state).toFixed(1)}
              {getAttribute(tempState, "unit_of_measurement")}
            </div>
            <div tw="mr-1 flex rounded-md border-2 border-black/20 px-2 py-1">
              💧 {parseFloat(humidityState.state).toFixed(0)}
              {getAttribute(humidityState, "unit_of_measurement")}
            </div>
            {occupancyState.state === "on" && (
              <div tw="mr-1 flex rounded-md border-2 border-black/20 px-2 py-1">
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
              width={256}
              height={220}
              src="https://skog-einvoice.gnehs.net/djungelskog.png"
              style={{
                filter: `brightness(150%)`,
              }}
            />
          </div>
        </div>
        <div tw="mb-2 flex justify-between">
          {playerState.state === "playing" && (
            <div
              tw={`mr-2 flex w-[49.5%] items-center rounded-md bg-black/10 p-2 ${
                playerEntityPicture ? "px-2" : "px-4"
              }`}
            >
              {playerEntityPicture ? (
                <img
                  src={`${process.env.HOME_ASSISTANT_HOST}${playerEntityPicture}`}
                  tw="rounded"
                  style={{
                    height: `64px`,
                  }}
                />
              ) : (
                <div
                  tw="text-3xl"
                  style={{
                    display: "block",
                    minWidth: "32px",
                  }}
                >
                  🎵
                </div>
              )}
              <div tw="flex flex-col pl-4 pr-20">
                {playerMediaTitle && (
                  <div
                    tw="text-2xl"
                    style={{
                      display: "block",
                      lineClamp: 2,
                    }}
                  >
                    {playerMediaTitle}
                  </div>
                )}
                {playerMediaArtist && (
                  <div
                    tw="opacity-50"
                    style={{
                      display: "block",
                      lineClamp: 2,
                    }}
                  >
                    {playerMediaArtist}
                  </div>
                )}
              </div>
            </div>
          )}
          <div
            tw={`flex items-center justify-between rounded-md bg-black/10 p-2 px-4 ${playerState.state === "playing" ? "w-[49.5%]" : "w-full"}`}
          >
            <div tw="flex text-3xl">
              {getWeatherIcon(weatherState.state)}{" "}
              {WeatherStates[
                weatherState.state as keyof typeof WeatherStates
              ] ?? weatherState.state}
            </div>
            <div tw="flex text-2xl">
              {getAttribute(weatherState, "temperature")}
              {getAttribute(weatherState, "temperature_unit")}
            </div>
          </div>
        </div>
        <div tw="flex w-full justify-between">
          <div tw="flex w-[32.5%] flex-col rounded-md bg-black/10 p-2 shadow">
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
                  {getAttribute(deskPowerState, "unit_of_measurement")}
                </div>
              </div>
            </div>
            <div tw="mt-2 flex">
              <MiniCard
                title="衣櫃上"
                value={parseFloat(closetPowerStateUpper.state)}
                unit={getAttribute(closetPowerStateUpper, "unit_of_measurement")}
              />
              <MiniCard
                title="衣櫃下"
                value={parseFloat(closetPowerStateDown.state)}
                unit={getAttribute(closetPowerStateDown, "unit_of_measurement")}
              />
              <MiniCard
                title="書桌"
                value={parseFloat(deskPowerState.state)}
                unit={getAttribute(deskPowerState, "unit_of_measurement")}
              />
            </div>
          </div>
          <div tw="flex w-[32.5%] flex-col rounded-md bg-black/10 p-2 shadow">
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
          <div tw="flex w-[32.5%] flex-col rounded-md bg-black/10 p-2 shadow">
            <div tw="flex justify-between">
              <div>餅餅踏踏</div>
              <div>🚶</div>
            </div>
            <div tw="flex items-end">
              <div tw="flex text-4xl font-bold">
                {"steps" in last30dByDay[0]
                  ? last30dByDay[0].steps.toLocaleString()
                  : 0}
              </div>
              <div tw="ml-1 opacity-50">步</div>
            </div>
            <div tw="mt-2 flex">
              <MiniCard
                title="距離"
                value={
                  "distance" in last30dByDay[0] ? last30dByDay[0].distance : 0
                }
                unit="公里"
              />
              <MiniCard
                title="月均步數"
                value={
                  last30dByDay.reduce(
                    (a, b) => a + ("steps" in b ? b.steps : 0),
                    0,
                  ) / last30dByDay.filter((x) => "steps" in x).length
                }
                unit="步"
              />
            </div>
          </div>
        </div>
      </div>,
      {
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        //@ts-expect-error loadGoogleFonts is not typed
        fonts: await loadFonts(),
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
