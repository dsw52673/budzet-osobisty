"use client"

import { useDashboard } from "../../context/DashboardContext"
import { usePathname } from "next/navigation"

export default function MobileHeader() {
    const { userEmail, setIsMobileSidebarOpen } = useDashboard()
    const pathname = usePathname()

    if (!userEmail || pathname === "/login" || pathname === "/register") {
        return null
    }

    return (
        <div className="md:hidden fixed top-0 inset-x-0 z-50 flex items-center justify-between py-2 px-4 bg-[#131b2e] border-b border-slate-800/40 flex-shrink-0">
            <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-[#252f48] rounded-xl cursor-pointer"
                title="Otwórz menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            <span className="font-bold text-white text-sm">Budżet osobisty</span>
            <div className="w-10" />
        </div>
    )
}
