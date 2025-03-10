import { ImageResponse } from "@/utils/ImageResponse";
import { loadFonts } from "@/utils/font";
import { MetWeather, WeatherStates, getWeatherIcon } from "@/utils/met-weather";

import Error from "@/app/components/Error";

const IMG_WIDTH = 960;
const IMG_HEIGHT = 540;

export async function GET() {
  try {
    const metWeather = new MetWeather();

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
    // Taipei coordinates
    const weatherData = await metWeather.getForecast(
      process.env.WEATHER_LAT!,
      process.env.WEATHER_LON!,
    );
    const currentWeather = weatherData.properties.timeseries[0];
    const next24Hours = weatherData.properties.timeseries.slice(1, 9);

    return ImageResponse(
      <div
        tw="flex flex-col p-4 text-2xl"
        lang="zh-TW"
        style={{
          width: IMG_WIDTH,
          height: IMG_HEIGHT,
        }}
      >
        <div tw="relative flex w-full flex-1 flex-col">
          <div tw="-mx-2 flex justify-between">
            <WeatherCard
              title="天氣"
              value={
                (WeatherStates[
                  currentWeather.data.next_1_hours?.summary
                    .symbol_code as keyof typeof WeatherStates
                ] ||
                  currentWeather.data.next_1_hours?.summary.symbol_code ||
                  "") +
                " " +
                getWeatherIcon(
                  currentWeather.data.next_1_hours?.summary.symbol_code || "",
                )
              }
              width={IMG_WIDTH / 3 - 8}
            />
            <WeatherCard
              title="氣溫"
              subtitle={`${Math.min(
                ...next24Hours.map(
                  (hour) => hour.data.instant.details.air_temperature,
                ),
              ).toFixed(1)}°C / ${Math.max(
                ...next24Hours.map(
                  (hour) => hour.data.instant.details.air_temperature,
                ),
              ).toFixed(1)}°C`}
              value={currentWeather.data.instant.details.air_temperature}
              unit="°C"
              width={IMG_WIDTH / 3 - 8}
            />
            <WeatherCard
              title="相對濕度"
              value={currentWeather.data.instant.details.relative_humidity}
              unit="%"
              width={IMG_WIDTH / 3 - 8}
            />
          </div>
          <div tw="flex-1" />
          <div tw="flex flex-col items-start">
            <div tw="text-6xl font-bold">{currentTime}</div>
            <div tw="text-2xl opacity-50">{currentDate}</div>
          </div>
          <div tw="absolute bottom-0 right-0 flex justify-center">
            <img
              width="288"
              height="247.5"
              src="https://skog-einvoice.gnehs.net/djungelskog.png"
              style={{
                filter: `brightness(150%)`,
              }}
            />
          </div>
        </div>
        <div tw="flex items-center justify-between pt-4">
          {next24Hours.slice(0, 8).map((hour, index) => (
            <MiniWeatherCard
              key={index}
              time={new Date(hour.time).getHours().toString().padStart(2, "0")}
              temperature={hour.data.instant.details.air_temperature}
              symbol={hour.data.next_1_hours?.summary.symbol_code}
              precipitation={
                hour.data.next_1_hours?.details.precipitation_amount
              }
            />
          ))}
        </div>
      </div>,
      {
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        emoji: "twemoji",
        //@ts-expect-error loadGoogleFonts is not typed
        fonts: await loadFonts(
          currentTime +
            currentDate +
            "1234567890.°C%/ mm" +
            WeatherStates[
              currentWeather.data.next_1_hours?.summary
                .symbol_code as keyof typeof WeatherStates
            ],
        ),
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

function MiniWeatherCard({
  time,
  temperature,
  symbol,
  precipitation,
}: {
  time: string;
  temperature: number;
  symbol?: string;
  precipitation?: number;
}) {
  return (
    <div tw="flex flex-col items-center justify-center rounded-xl border-2 border-[#888]">
      <div tw="w-full items-center justify-center rounded-t-lg bg-[#888] py-1 text-center text-white">
        {time}
      </div>
      <div tw="flex flex-col px-4 py-2">
        <div tw="my-2 flex items-center justify-center text-6xl">
          {symbol && getWeatherIcon(symbol)}
        </div>
        <div tw="flex items-end">
          <div tw="mr-1">{temperature.toFixed(1)}</div>
          <div tw="flex text-base opacity-50">°C</div>
        </div>
        {precipitation !== undefined && (
          <div tw="flex items-end">
            <div tw="mr-1">{precipitation.toFixed(1)}</div>
            <div tw="flex text-base opacity-50">mm</div>
          </div>
        )}
      </div>
    </div>
  );
}

function WeatherCard({
  title,
  subtitle = "",
  value,
  unit = "",
  width = IMG_WIDTH / 3,
}: {
  title: string;
  subtitle?: string;
  value: number | string;
  unit?: string;
  width?: number;
}) {
  return (
    <div
      tw="flex flex-col items-center px-2"
      style={{
        width,
      }}
    >
      <div
        tw="flex w-full flex-col px-2 py-1"
        style={{
          width: width - 8,
        }}
      >
        <div tw="flex items-center justify-between text-xl">
          <div>{title}</div>
          <div tw="text-base opacity-50">{subtitle}</div>
        </div>
        <div tw="flex items-end">
          <div tw="flex text-4xl font-bold">
            {typeof value === "string"
              ? value
              : value.toLocaleString("zh-TW", {
                  maximumFractionDigits: 1,
                })}
          </div>
          <div tw="ml-1 opacity-50">{unit}</div>
        </div>
      </div>
      <div tw="h-1 w-full rounded-full bg-[#aaa]" />
    </div>
  );
}
