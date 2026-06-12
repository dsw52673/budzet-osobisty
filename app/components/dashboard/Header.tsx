import { useDashboard } from "../../context/DashboardContext"

export default function Header() {
    const { availableFunds, totalExpenses } = useDashboard()

    return (
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 md:p-10 border-b border-slate-800/40">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">Dzień dobry</h1>
                <p className="text-slate-400 text-sm mt-1">Oto Twoje podsumowanie finansowe na ten miesiąc.</p>
            </div>

            <div className="flex gap-4 w-full sm:w-auto">
                <div className="bg-[#1b253b] border border-slate-800/40 px-6 py-3 rounded-2xl flex-1 sm:flex-none">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Dostępne środki</span>
                    <span className={`text-lg sm:text-xl font-extrabold ${availableFunds >= 0 ? "text-white" : "text-red-400"}`}>
                        {availableFunds.toFixed(2)} PLN
                    </span>
                </div>
                <div className="bg-[#1b253b] border border-slate-800/40 px-6 py-3 rounded-2xl flex-1 sm:flex-none">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Wydatki</span>
                    <span className="text-lg sm:text-xl font-extrabold text-white">
                        {totalExpenses.toFixed(2)} PLN
                    </span>
                </div>
            </div>
        </header>
    )
}
