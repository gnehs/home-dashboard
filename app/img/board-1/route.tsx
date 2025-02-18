import { ImageResponse } from "next/og";
export async function GET() {
  const currentDate = new Date().toLocaleDateString("zh-TW");
  const currentTime = new Date().toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return new ImageResponse(
    (
      <div
        tw="flex h-[540px] w-[960px] flex-col bg-white p-2 text-xl"
        lang="zh-TW"
      >
        <div tw="flex w-full items-center justify-between">
          <div tw="flex">
            <div tw="mr-1 rounded-md border-2 border-gray-100 px-2 py-1">
              🌡️ 22.3°
            </div>
            <div tw="mr-1 rounded-md border-2 border-gray-100 px-2 py-1">
              💧 45%
            </div>
            <div tw="mr-1 rounded-md border-2 border-gray-100 px-2 py-1">
              👤 已偵測
            </div>
          </div>
          <div tw="flex items-center">
            <div tw="mr-2 opacity-50">{currentDate}</div>
            <div tw="rounded-full border-2 border-black bg-black px-2 text-xl text-white">
              {currentTime}
            </div>
          </div>
        </div>
        <div tw="flex w-full flex-1 flex-col items-center justify-center">
          <div tw="flex w-full flex-col justify-between p-8 px-4 py-12 md:flex-row md:items-center">
            <h2 tw="flex text-left text-6xl font-bold tracking-tight text-gray-900">
              <span>早安！</span>
              <span tw="opacity-50">勝勝</span>
            </h2>
            <div tw="mt-8 flex md:mt-0">
              <div tw="flex rounded-md shadow">
                <a
                  href="#"
                  tw="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white"
                >
                  Get started
                </a>
              </div>
              <div tw="ml-3 flex rounded-md shadow">
                <a
                  href="#"
                  tw="flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600"
                >
                  Learn more
                </a>{" "}
                <img
                  width="256"
                  height="256"
                  src={`/djungelskog.png`}
                  style={{
                    borderRadius: 128,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div tw="mb-2 flex w-full items-center justify-between rounded-md border-2 border-gray-200 p-2">
          <div tw="flex text-4xl"> ☁️ 多雲</div>
          <div tw="flex flex-col items-end">
            <div tw="text-2xl">14.7°</div>
            <div>14.5° / 14.2°</div>
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
                <div tw="text-4xl font-bold"> 255</div>
                <div tw="ml-1">W</div>
              </div>
              <div tw="mr-2 flex flex-col rounded bg-gray-200 px-2">
                <div tw="opacity-50">衣櫃上</div>
                <div tw="text-2xl">1W</div>
              </div>
              <div tw="mr-2 flex flex-col rounded bg-gray-200 px-2">
                <div tw="opacity-50">衣櫃下</div>
                <div tw="text-2xl">3W</div>
              </div>
              <div tw="mr-2 flex flex-col rounded bg-gray-200 px-2">
                <div tw="opacity-50">書桌</div>
                <div tw="text-2xl">111W</div>
              </div>
            </div>
            <div tw="mt-2 flex"></div>
          </div>
          <div tw="flex w-[32.5%] flex-col rounded-md bg-gray-100 p-2 shadow">
            <div tw="flex justify-between">
              <div>BTC</div>
              <div>💰</div>
            </div>
            <div tw="flex items-end">
              <div tw="text-4xl font-bold"> 95,372</div>
              <div tw="ml-1">USD </div>
            </div>
            <div>−0.37%</div>
          </div>
          <div tw="flex w-[32.5%] flex-col rounded-md bg-gray-100 p-2 shadow">
            <div tw="flex justify-between">
              <div>步數</div>
              <div>🚶</div>
            </div>
            <div tw="flex items-end">
              <div tw="text-4xl font-bold">4,321</div>
              <div tw="ml-1">步</div>
            </div>
            <div tw="mt-1 flex">
              <div tw="mr-1 rounded bg-gray-200 px-1">七日平均 6,532 步</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 960,
      height: 540,
      emoji: "fluentFlat",
    },
  );
}
