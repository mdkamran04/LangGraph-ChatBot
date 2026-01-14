export function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        min-h-screen flex items-center justify-center px-4
        bg-gradient-to-br
        from-[#e6ebf5] via-[#f4f2ee] to-[#e8edff]
      "
    >
      <div
        className="
          relative w-full max-w-3xl h-[85vh]
          rounded-[28px]
          bg-gradient-to-br
          from-[#eef1ff]/80 via-[#f3efe9]/85 to-[#e7ebff]/80
          backdrop-blur-2xl
          border border-[#d8ddf0]/70
          shadow-[0_30px_90px_rgba(40,60,120,0.18)]
          flex flex-col overflow-hidden
        "
      >
        {/* inner glass glow */}
        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/30" />

        {/* header */}
        <div
          className="
            px-6 py-4
            bg-gradient-to-r from-[#ede9df]/70 via-[#f1efff]/70 to-[#e8ebff]/70
            backdrop-blur
            border-b border-[#dcdff3]/60
          "
        >
          <h1
            className="
              text-[17px] font-semibold tracking-tight
              text-slate-800
            "
          >
            LangMiwi
          </h1>

          <div className="mt-2 h-[2px] w-10 rounded-full bg-gradient-to-r from-amber-400 via-indigo-400 to-sky-400" />
        </div>

        {children}
      </div>
    </div>
  );
}
