import Link from "next/link"

interface SidebarProps {
  onAddExpenseClick: () => void
  onLogout: () => void
}

export default function Sidebar({ onAddExpenseClick, onLogout }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#131b2e] border-r border-slate-800/40 p-6 flex-shrink-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-[#1b253b] rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V11M12 21V11M5 21V11M3 11h18M3 21h18M12 3L3 7h18l-9-4z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white leading-none">Budget</h2>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 bg-[#252f48] text-white rounded-xl font-medium transition-colors cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Dashboard</span>
        </Link>
      </nav>

      <button
        onClick={onAddExpenseClick}
        className="w-full py-3.5 mb-6 bg-[#b5c7e3] hover:bg-[#a7b9d5] text-[#0a1120] font-bold rounded-xl shadow-lg shadow-[#b5c7e3]/10 cursor-pointer flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Dodaj wydatek</span>
      </button>

      <div className="border-t border-slate-800/60 pt-6 space-y-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 rounded-xl transition-colors cursor-pointer text-left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Wyloguj się</span>
        </button>
      </div>
    </aside>
  )
}
