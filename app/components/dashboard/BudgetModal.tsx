import { useDashboard } from "../../context/DashboardContext"

export default function BudgetModal() {
    const {
        isBudgetModalOpen,
        setIsBudgetModalOpen,
        error,
        loading,
        budgetLimit,
        setBudgetLimit,
        handleSaveBudget,
        incrementBudget,
        decrementBudget
    } = useDashboard()

    if (!isBudgetModalOpen) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1120]/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#1b253b] border border-slate-800/40 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Ustaw limit budżetu</h3>
                    <button onClick={() => setIsBudgetModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm px-4 py-3 rounded-2xl mb-6">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSaveBudget} className="space-y-6">
                    <div>
                        <label htmlFor="budget-input" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Limit miesięczny (PLN)</label>
                        <div className="relative">
                            <input
                                id="budget-input"
                                type="number"
                                required
                                min="1"
                                step="any"
                                value={budgetLimit}
                                onChange={(e) => setBudgetLimit(e.target.value)}
                                className="w-full pl-4 pr-12 py-3.5 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="Wpisz limit np. 5000"
                            />
                            <div className="absolute inset-y-0 right-0 flex flex-col w-10 border-l border-slate-700/45">
                                <button
                                    type="button"
                                    onClick={incrementBudget}
                                    className="flex-1 flex items-center justify-center hover:bg-slate-700/40 text-slate-400 hover:text-white rounded-tr-2xl transition-colors cursor-pointer border-b border-slate-700/45"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={decrementBudget}
                                    className="flex-1 flex items-center justify-center hover:bg-slate-700/40 text-slate-400 hover:text-white rounded-br-2xl transition-colors cursor-pointer"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-[#b5c7e3] hover:bg-[#a7b9d5] active:bg-[#99acca] text-[#0a1120] font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#b5c7e3]/10"
                    >
                        {loading ? (
                            <div className="animate-spin h-5 w-5 border-2 border-[#0a1120] border-t-transparent rounded-full" />
                        ) : "Zapisz limit"}
                    </button>
                </form>
            </div>
        </div>
    )
}
