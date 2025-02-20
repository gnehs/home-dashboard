"use client";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <div className="flex h-[100svh] w-[100vw] flex-col items-center text-gray-900">
      <div className="sticky top-0 w-full border-b border-gray-200 p-2 px-4">
        <div className="max-w-2xl">
          <div className="text-2xl font-bold tracking-tighter">
            Home Dashboard
          </div>
        </div>
      </div>
      <div className="my-8 flex max-w-[514px] flex-col items-center gap-2">
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
          description="連接 Home Assistant 與 StepStep，可即時顯示家庭狀況與步行資料，這個圖片需要進行 API Token 設定與進行修改，若您未設定可能會無法顯示。"
        />
        <Card
          title="匯率"
          url="/img/currency"
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
}: {
  title: string;
  url: string;
  description: string;
}) {
  const [currentBaseURL, setCurrentBaseURL] = useState<string>("");
  useEffect(() => {
    setCurrentBaseURL(new URL(url, window.location.origin).toString());
  }, []);
  return (
    <div className="rounded border border-gray-200 p-4">
      <div className="group relative w-[480px] border-2 border-dashed border-gray-200">
        <div className="absolute right-2 top-2 z-10 rounded bg-gray-200/50 p-2 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
          <a
            href={currentBaseURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 underline"
          >
            {currentBaseURL}
          </a>
        </div>
        <img src={url} alt={title} className="min-h-[270px] w-full grayscale" />
      </div>
      <div className="mt-2 text-xl font-bold text-gray-900">{title}</div>
      <div className="text-gray-600">{description}</div>
    </div>
  );
}
