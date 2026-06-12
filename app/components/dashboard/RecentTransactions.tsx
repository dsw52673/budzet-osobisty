import { useDashboard } from "../../context/DashboardContext"
import { formatDate } from "../../lib/utils/dashboard"

export default function RecentTransactions() {
    const { recentTransactions, setIsAllTransactionsModalOpen } = useDashboard()

    return (
        <div className="lg:col-span-2 bg-[#1b253b] border border-slate-800/40 rounded-[2rem] p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">Ostatnie Transakcje</h3>
                <button
                    onClick={() => setIsAllTransactionsModalOpen(true)}
                    className="text-xs sm:text-sm text-sky-blue-light-400 hover:text-sky-blue-light-300 font-bold transition-colors cursor-pointer"
                >
                    Pokaż wszystkie
                </button>
            </div>

            {recentTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/60 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                <th className="pb-3">Kategoria</th>
                                <th className="pb-3">Opis</th>
                                <th className="pb-3">Data</th>
                                <th className="pb-3 text-right">Kwota</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40 text-slate-200">
                            {recentTransactions.map((item) => (
                                <tr key={item.id} className="hover:bg-[#252f48]/20 transition-colors">
                                    <td className="py-4 font-semibold flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-sky-blue-light-400" />
                                        {item.category?.name || "Inne"}
                                    </td>
                                    <td className="py-4 text-slate-400 font-medium max-w-[150px] truncate">
                                        {item.description || "—"}
                                    </td>
                                    <td className="py-4 text-slate-400 font-semibold">{formatDate(item.date)}</td>
                                    <td className="py-4 text-right">
                                        <div className="font-black text-white">
                                            -{Number(item.amount).toFixed(2)} {item.currency || "PLN"}
                                        </div>
                                        {item.currency && item.currency !== "PLN" && (
                                            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                                ~{Number(item.amountInBase).toFixed(2)} PLN
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-12">
                    <span className="text-sm text-slate-400">Brak zarejestrowanych transakcji.</span>
                </div>
            )}
        </div>
    )
}
