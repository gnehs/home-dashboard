export default function Error({ error }: { error: Error }) {
  const date = new Date();
  return (
    <div tw="flex h-[540px] w-[960px] flex-col bg-white text-xl" lang="zh-TW">
      <div tw="mt-2 flex w-full flex-1 flex-col justify-center p-2 px-6">
        <div tw="flex flex-col">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>

          <div tw="mt-2 flex text-4xl">Error</div>
          <div tw="text-2xl opacity-75">
            {error instanceof Error ? error.message : "Unknown Error"}
          </div>
        </div>
      </div>

      <div tw="flex w-full items-center justify-between bg-gray-50 p-2 px-6">
        <div>Home Dashboard</div>
        <div tw="p-2 opacity-50">{date.toLocaleString("zh-TW")}</div>
      </div>
    </div>
  );
}
