export function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        flex flex-col flex-1 h-full
        bg-gradient-to-br
        from-[#e7ebf3] via-[#f1f0ec] to-[#e6eaff]
      "
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-black/5 bg-transparent">
        <h1 className="text-[17px] font-semibold text-zinc-800">
          LangMiwi
        </h1>
        <div className="mt-2 h-[2px] w-10 rounded-full bg-[#d4af37]/80" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
