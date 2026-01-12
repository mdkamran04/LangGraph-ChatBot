export function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#f2f4f8] via-white to-[#eef2ff] flex items-center justify-center px-4">
      <div className="w-full max-w-3xl h-[85vh] rounded-4xl bg-white/60 backdrop-blur-2xl border border-white/70 shadow-[0_30px_90px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden">
        <div className="px-6 py-4 bg-white/70 backdrop-blur border-b border-white/60">
          <h1 className="text-[17px] font-semibold text-zinc-800">
            LangGraph
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
