"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDashboard } from "../../context/DashboardContext"

export default function Sidebar() {
    const { setIsExpenseModalOpen, setExpenseDate, handleLogout } = useDashboard()
    const pathname = usePathname()

    const handleAddExpenseClick = () => {
        setExpenseDate(new Date().toISOString().split("T")[0])
        setIsExpenseModalOpen(true)
    }

    return (
        <aside className="hidden md:flex flex-col w-64 bg-[#131b2e] border-r border-slate-800/40 p-6 flex-shrink-0">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#1b253b] rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V11M12 21V11M5 21V11M3 11h18M3 21h18M12 3L3 7h18l-9-4z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white leading-none">Budżet osobisty</h2>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                <Link
                    href="/"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${
                        pathname === "/"
                            ? "bg-[#252f48] text-white"
                            : "text-slate-400 hover:text-white hover:bg-[#1a233a]/50"
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span>Dashboard</span>
                </Link>

                <Link
                    href="/profile"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${
                        pathname === "/profile"
                            ? "bg-[#252f48] text-white"
                            : "text-slate-400 hover:text-white hover:bg-[#1a233a]/50"
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profil</span>
                </Link>
                <Link
                    href="/transactions"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${pathname === "/transactions"
                            ? "bg-[#252f48] text-white"
                            : "text-slate-400 hover:text-white hover:bg-[#252f48]/40"
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Transakcje</span>
                </Link>
            </nav>

            <button
                onClick={handleAddExpenseClick}
                className="w-full py-3.5 mb-6 bg-[#b5c7e3] hover:bg-[#a7b9d5] text-[#0a1120] font-bold rounded-xl shadow-lg shadow-[#b5c7e3]/10 cursor-pointer flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Dodaj wydatek</span>
            </button>

            <div className="border-t border-slate-800/60 pt-6 space-y-2">
                <button
                    onClick={handleLogout}
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
