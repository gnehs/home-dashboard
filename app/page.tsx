export default function Home() {
  return (
    <div className="flex h-[100svh] w-[100vw] flex-col items-center justify-center">
      <div className="w-[480px] border-2 border-gray-200">
        <img
          src="/img/board-1"
          alt="board-1"
          className="min-h-[270px] w-full grayscale"
        />
      </div>
      <div className="mt-1 text-xl">Home Dashboard - 1</div>
    </div>
  );
}
