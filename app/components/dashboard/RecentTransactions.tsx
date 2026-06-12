import Link from "next/link"
import { useDashboard } from "../../context/DashboardContext"
import { formatDate } from "../../lib/utils/dashboard"

export default function RecentTransactions() {
    const { recentTransactions } = useDashboard()

    return (
        <div className="lg:col-span-3 bg-[#1b253b] border border-slate-800/40 rounded-[2rem] p-6 sm:p-8 lg:p-4 xl:p-6">
            <div className="flex justify-between items-center mb-6 lg:mb-3 xl:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">Ostatnie Transakcje</h3>
                <Link
                    href="/transactions"
                    className="text-xs sm:text-sm text-sky-blue-light-400 hover:text-sky-blue-light-300 font-bold transition-colors cursor-pointer"
                >
                    Pokaż wszystkie
                </Link>
            </div>

            {recentTransactions.length > 0 ? (
                <div className="overflow-x-auto lg:max-h-[140px] xl:max-h-[180px] lg:overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/60 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                <th className="pb-3 lg:pb-2">Kategoria</th>
                                <th className="pb-3 lg:pb-2 hidden sm:table-cell">Opis</th>
                                <th className="pb-3 lg:pb-2 hidden sm:table-cell">Data</th>
                                <th className="pb-3 lg:pb-2 text-right">Kwota</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40 text-slate-200">
                            {recentTransactions.map((item) => (
                                <tr key={item.id} className="hover:bg-[#252f48]/20 transition-colors">
                                    <td className="py-4 lg:py-2 xl:py-3 font-semibold flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-sky-blue-light-400 hidden sm:inline-block" />
                                        {item.category?.name || "Inne"}
                                    </td>
                                    <td className="py-4 lg:py-2 xl:py-3 text-slate-400 font-medium max-w-[150px] truncate hidden sm:table-cell">
                                        {item.description || "—"}
                                    </td>
                                    <td className="py-4 lg:py-2 xl:py-3 text-slate-400 font-semibold hidden sm:table-cell">{formatDate(item.date)}</td>
                                    <td className="py-4 lg:py-2 xl:py-3 text-right">
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
                <div className="flex flex-col items-center justify-center text-center py-12 lg:py-6">
                    <span className="text-sm text-slate-400">Brak zarejestrowanych transakcji.</span>
                </div>
            )}
        </div>
    )
}
