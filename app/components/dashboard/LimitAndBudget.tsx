import { useDashboard } from "../../context/DashboardContext"

export default function LimitAndBudget() {
    const {
        totalBudgetLimit,
        percentUsed,
        svgProgress,
        setBudgetLimit,
        setIsBudgetModalOpen
    } = useDashboard()

    const { radius, circumference, strokeDashoffset, circleColor } = svgProgress

    const handleEditLimitClick = () => {
        setBudgetLimit(totalBudgetLimit > 0 ? totalBudgetLimit.toString() : "")
        setIsBudgetModalOpen(true)
    }

    return (
        <div className="bg-[#1b253b] border border-slate-800/40 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center">
            <h3 className="text-lg sm:text-xl font-bold text-white self-start mb-6">Limit i Budżet</h3>

            {totalBudgetLimit > 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r={radius} className="fill-none stroke-[#252f48]" strokeWidth="10" />
                            <circle
                                cx="60"
                                cy="60"
                                r={radius}
                                className={`fill-none ${circleColor} transition-all duration-500`}
                                strokeWidth="10"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center text-center">
                            <span className="text-2xl font-black text-white">{percentUsed.toFixed(0)}%</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Zużycia</span>
                        </div>
                    </div>

                    <div className="w-full mt-6 space-y-2 bg-[#0a1120]/30 border border-slate-800/30 rounded-2xl p-4 text-center">
                        <span className="block text-xs font-semibold text-slate-400">Twój miesięczny limit to</span>
                        <span className="text-xl font-black text-white">{totalBudgetLimit.toFixed(2)} PLN</span>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-14 h-14 bg-[#0a1120]/60 rounded-full flex items-center justify-center mb-4 text-slate-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h4 className="font-bold text-sm text-white mb-2">Brak ustalonego limitu</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">
                        Ustaw swój miesięczny budżet, aby móc śledzić statystyki i ostrzeżenia.
                    </p>
                </div>
            )}

            <button
                onClick={handleEditLimitClick}
                className="w-full mt-6 py-3 bg-[#252f48] hover:bg-[#2e3b5a] text-slate-200 font-semibold rounded-2xl transition-all cursor-pointer text-sm"
            >
                {totalBudgetLimit > 0 ? "Edytuj limit" : "Ustaw limit"}
            </button>
        </div>
    )
}
