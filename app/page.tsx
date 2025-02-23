"use client";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <div className="flex h-[100svh] w-[100vw] flex-col items-center text-gray-900">
      <div className="sticky top-0 z-20 w-full border-b border-gray-200 bg-white/95 p-2 px-4 backdrop-blur">
        <div className="max-w-2xl">
          <div className="text-2xl font-bold tracking-tighter">
            Home Dashboard
          </div>
        </div>
      </div>
      <div className="flex max-w-[514px] flex-col items-center gap-2 py-8">
        <h1 className="w-full text-left text-2xl font-bold">
          歡迎來到 <span className="tracking-tighter">Home Dashboard</span>
        </h1>
        <p className="w-full text-left text-sm text-gray-600">
          當你看到本頁面時，表示這個專案已經成功部署，你可以查看下方範例，或是動手修改程式碼來建立自己的主控板！
        </p>
        <p className="w-full text-left text-sm text-gray-600">
          圖片的產生基於{" "}
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Next.js
          </a>{" "}
          與 @vercel/og 套件，你可以閱讀{" "}
          <a
            href="https://vercel.com/docs/functions/og-image-generation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Vercel 官方文件
          </a>{" "}
          了解如何進行修改，或是也可以叫 AI 幫忙改。
        </p>
        <Card
          title="家庭監測面板"
          url="/img/board-1"
          description="連接 Home Assistant 與 StepStep，可即時顯示家庭狀況與步行資料"
          notice="這個主控板需要進行 API Host 與 token 設定與並針對您的 Home Assistant 裝置 ID 進行修改，若未進行上述步驟將無法正常顯示。"
        />
        <Card
          title="今日"
          url="/img/day-clock"
          description="視覺化呈現的顯示今天還有多少分鐘"
        />
        <Card
          title="天氣"
          url="/img/weather"
          description="即時顯示天氣資訊"
          notice="預設位置為台北，若要變更區域需要修改環境變數"
        />
        <Card
          title="匯率"
          url="/img/currency"
          description="即時顯示加密貨幣與台銀匯率相關資訊"
        />
        <Card
          title="匯率 - 樣式 2"
          url="/img/currency-2"
          description="即時顯示加密貨幣與台銀匯率相關資訊"
        />
      </div>
    </div>
  );
}
function Card({
  title,
  url,
  description,
  notice,
}: {
  title: string;
  url: string;
  description: string;
  notice?: string;
}) {
  const [currentBaseURL, setCurrentBaseURL] = useState<string>("");
  useEffect(() => {
    setCurrentBaseURL(new URL(url, window.location.origin).toString());
  }, []);
  return (
    <div className="rounded border border-gray-200 p-4">
      <div className="group relative w-[480px] border-2 border-dashed border-gray-200 bg-gray-300">
        <div className="absolute bottom-2 left-0 right-0 z-10 m-auto h-max w-max origin-bottom scale-0 rounded border border-gray-200 bg-white p-1 px-3 opacity-0 shadow-sm transition-all group-hover:scale-100 group-hover:opacity-100">
          <a
            href={currentBaseURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 underline"
          >
            {currentBaseURL}
          </a>
        </div>
        <img
          src={url}
          alt={title}
          className="min-h-[270px] w-full grayscale transition-opacity group-hover:opacity-90"
        />
      </div>
      <div className="mt-2 text-xl font-bold text-gray-900">{title}</div>
      <div className="text-gray-600">{description}</div>
      {notice && (
        <div className="mt-2 border-l-4 border-gray-200 pl-2 text-sm text-gray-400">
          {notice}
        </div>
      )}
    </div>
  );
}
