export default function Home() {
  return (
    <div className="flex h-[100svh] w-[100vw] flex-col items-center justify-center gap-2">
      <Card
        title="家庭監測面板"
        url="/img/board-1"
        description="連接 Home Assistant 與 StepStep，可即時顯示家庭狀況與步行資料"
      />
      <Card
        title="匯率"
        url="/img/currency"
        description="即時顯示加密貨幣與台銀匯率相關資訊"
      />
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
  return (
    <div className="rounded border border-gray-200 p-4">
      <div className="w-[480px] border-2 border-dashed border-gray-200">
        <img src={url} alt={title} className="min-h-[270px] w-full grayscale" />
      </div>
      <div className="mt-2 text-xl font-bold text-gray-900">{title}</div>
      <div className="text-gray-600">{description}</div>
    </div>
  );
}
