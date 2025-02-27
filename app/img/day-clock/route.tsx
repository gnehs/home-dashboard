import { ImageResponse } from "@/utils/ImageResponse";
import { loadGoogleFonts } from "@/utils/font";

import Error from "@/app/components/Error";

const IMG_WIDTH = 960;
const IMG_HEIGHT = 540;

export async function GET() {
  try {
    const date = new Date();
    const currentTime = date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const currentDate = date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    const DAY_PASSED = date.getHours() * 60 + date.getMinutes();

    return ImageResponse(
      <div
        tw="flex flex-col items-center justify-center bg-black p-2 text-2xl text-white"
        lang="zh-TW"
        style={{
          width: IMG_WIDTH,
          height: IMG_HEIGHT,
        }}
      >
        <div tw="mt-4 flex flex-col items-center">
          <div tw="text-6xl font-bold">{currentTime}</div>
          <div tw="text-2xl opacity-50">{currentDate}</div>
        </div>
        <div tw="flex flex-1 flex-col items-center justify-center">
          {Array.from({ length: 24 }, (_, hour) => (
            <div tw="flex" key={hour}>
              {Array.from({ length: 60 }, (_, minute) => {
                const currentMinute = hour * 60 + minute;
                return (
                  <div
                    key={minute}
                    tw={[
                      "mb-1 mr-1 h-[11px] w-[11px] rounded-sm",
                      currentMinute < DAY_PASSED
                        ? "bg-white/50" // passed
                        : currentMinute === DAY_PASSED
                          ? "bg-white shadow" // current
                          : "bg-white/10",
                    ].join(" ")}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>,
      {
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        emoji: "twemoji",
        //@ts-expect-error loadGoogleFonts is not typed
        fonts: await loadGoogleFonts(currentTime + currentDate),
      },
    );
  } catch (e) {
    return ImageResponse(<Error error={e as Error} width={IMG_WIDTH} />, {
      width: IMG_WIDTH,
      height: IMG_HEIGHT,
      //@ts-expect-error loadGoogleFonts is not typed
      fonts: await loadGoogleFonts(),
      emoji: "twemoji",
    });
  }
}
