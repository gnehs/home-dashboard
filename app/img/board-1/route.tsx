import { ImageResponse } from "next/og";
import { HomeAssistant } from "@/utils/homeAssistant";

// 創建實例
const ha = new HomeAssistant(
  process.env.HOME_ASSISTANT_HOST!, // Home Assistant 的網址
  process.env.HOME_ASSISTANT_TOKEN!, // 你的 Access Token
);
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
  ] = await Promise.all([
    ha.getState("sensor.ble_temperature_gnehs_temp"),
    ha.getState("sensor.ble_humidity_gnehs_temp"),
    ha.getState("binary_sensor.unknown_occupancy"),
    ha.getState("weather.yong_he_bao_bao"),
    ha.getState("sensor.tasmota_energy_power_7"),
    ha.getState("sensor.tasmota_energy_power"),
    ha.getState("sensor.tasmota_energy_power_5"),
  ]);

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
            <div
              tw={`mr-1 flex rounded-md border-2 border-gray-100 px-2 py-1 ${occupancyState.state !== "on" ? "border-dashed" : ""}`}
            >
              👤 {occupancyState.state === "on" ? "已偵測" : "未偵測"}
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

        <div tw="my-2 flex w-full items-center justify-between rounded-md bg-gray-100 p-2">
          <div tw="flex text-4xl"> ☁️ {weatherState.state}</div>
          <div tw="flex text-2xl">
            {weatherState.attributes.temperature}
            {weatherState.attributes.temperature_unit}
          </div>
        </div>
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
              <div>−0.37%</div>
            </div>
            <div tw="flex items-end">
              <div tw="text-4xl font-bold">95,372</div>
              <div tw="ml-1 opacity-50">USD</div>
            </div>
            <div tw="mt-1 flex justify-between">
              <div>JPY/TWD</div>
              <div>−0.09%</div>
            </div>
            <div tw="flex items-end">
              <div tw="text-4xl font-bold">0.213</div>
              <div tw="ml-1 opacity-50">TWD</div>
            </div>
          </div>
          <div tw="flex w-[32.5%] flex-col rounded-md bg-gray-100 p-2 shadow">
            <div tw="flex justify-between">
              <div>步數</div>
              <div>🚶</div>
            </div>
            <div tw="flex items-end">
              <div tw="text-4xl font-bold">4,321</div>
              <div tw="ml-1 opacity-50">步</div>
            </div>
            <div tw="mt-2 flex">
              <MiniCard title="7 日平均" value={6_532} unit="步" />
              <MiniCard title="30 日平均" value={5_962} unit="步" />
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
        {value.toLocaleString()}
        <div tw="ml-1 text-base opacity-50">{unit}</div>
      </div>
      <div tw="text-base opacity-50">{title}</div>
    </div>
  );
}
