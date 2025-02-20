import { ImageResponse } from "next/og";

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
              🌡️ 25.0°C
            </div>
            <div tw="mr-1 flex rounded-md border-2 border-gray-100 px-2 py-1">
              💧 60%
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

        <div tw="mb-2 flex w-full items-center justify-between rounded-md bg-gray-100 p-2 px-4">
          <div tw="flex text-3xl">☁️ 晴時多雲</div>
          <div tw="flex text-2xl">25°C</div>
        </div>

        <div tw="flex w-full justify-between">
          <div tw="flex w-[32.5%] flex-col rounded-md bg-gray-100 p-2 shadow">
            <div tw="flex justify-between">
              <div>勝勝房間</div>
              <div>⚡️</div>
            </div>
            <div tw="flex items-center">
              <div tw="mr-2 flex items-end">
                <div tw="flex text-4xl font-bold">150</div>
                <div tw="ml-1 flex">W</div>
              </div>
            </div>
            <div tw="mt-2 flex">
              <MiniCard title="衣櫃上" value={50} unit="W" />
              <MiniCard title="衣櫃下" value={50} unit="W" />
              <MiniCard title="書桌" value={50} unit="W" />
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
              <div>餅餅踏踏</div>
              <div>🚶</div>
            </div>
            <div tw="flex items-end">
              <div tw="flex text-4xl font-bold">8,000</div>
              <div tw="ml-1 opacity-50">步</div>
            </div>
            <div tw="mt-2 flex">
              <MiniCard title="距離" value={5.2} unit="公里" />
              <MiniCard title="月均步數" value={7500} unit="步" />
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
