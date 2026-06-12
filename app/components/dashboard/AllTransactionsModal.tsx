import { useDashboard } from "../../context/DashboardContext"
import { formatDate } from "../../lib/utils/dashboard"

export default function AllTransactionsModal() {
    const {
        isAllTransactionsModalOpen,
        setIsAllTransactionsModalOpen,
        currentMonthExpenses,
        deletingId,
        setDeletingId,
        handleDeleteExpense
    } = useDashboard()

    if (!isAllTransactionsModalOpen) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1120]/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-[#1b253b] border border-slate-800/40 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h3 className="text-xl font-bold text-white">Wszystkie wydatki w tym miesiącu</h3>
                    <button onClick={() => setIsAllTransactionsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    {currentMonthExpenses.length > 0 ? (
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800/60 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                    <th className="pb-3">Kategoria</th>
                                    <th className="pb-3">Opis</th>
                                    <th className="pb-3">Data</th>
                                    <th className="pb-3 text-right">Kwota</th>
                                    <th className="pb-3 text-right w-44">Akcja</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40 text-slate-200">
                                {[...currentMonthExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item) => (
                                    <tr key={item.id} className="hover:bg-[#252f48]/20 transition-colors">
                                        <td className="py-4 font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-sky-blue-light-400" />
                                            {item.category?.name || "Inne"}
                                        </td>
                                        <td className="py-4 text-slate-400 font-medium max-w-[150px] truncate">
                                            {item.description || "—"}
                                        </td>
                                        <td className="py-4 text-slate-400 font-semibold">{formatDate(item.date)}</td>
                                        <td className="py-4 text-right font-black text-white">-{Number(item.amount).toFixed(2)} PLN</td>
                                        <td className="py-4 text-right">
                                            {deletingId === item.id ? (
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleDeleteExpense(item.id)}
                                                        className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-red-600/10"
                                                    >
                                                        Potwierdzam
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingId(null)}
                                                        className="px-2.5 py-1.5 bg-[#252f48] hover:bg-[#2e3b5a] text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                                                    >
                                                        Anuluj
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeletingId(item.id)}
                                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/10 hover:shadow-red-600/25 cursor-pointer"
                                                >
                                                    Usuń
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12">
                            <span className="text-sm text-slate-400">Brak transakcji w tym miesiącu.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
