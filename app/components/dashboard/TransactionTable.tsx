import TransactionRow from "./TransactionRow"
import { Expense } from "../../lib/types"

interface TransactionTableProps {
    sortedExpenses: Expense[]
    visibleCount: number
    setVisibleCount: (val: number) => void
}

export default function TransactionTable({
    sortedExpenses,
    visibleCount,
    setVisibleCount
}: TransactionTableProps) {
    return (
        <div className="bg-[#1b253b] border border-slate-800/40 rounded-[2rem] p-6 sm:p-8">
            {sortedExpenses.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/60 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                <th className="pb-3">Kategoria</th>
                                <th className="pb-3">Opis</th>
                                <th className="pb-3">Data</th>
                                <th className="pb-3 text-right">Kwota</th>
                                <th className="pb-3 text-right w-32">Akcje</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40 text-slate-200">
                            {sortedExpenses.slice(0, visibleCount).map((item) => (
                                <TransactionRow key={item.id} item={item} />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-12">
                    <span className="text-sm text-slate-400">Brak zarejestrowanych transakcji pasujących do filtrów.</span>
                </div>
            )}

            {sortedExpenses.length > visibleCount && (
                <div className="flex justify-center mt-6 pt-4 border-t border-slate-800/40">
                    <button
                        onClick={() => setVisibleCount(sortedExpenses.length)}
                        className="px-6 py-2.5 bg-[#252f48] hover:bg-[#2e3b5a] text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                    >
                        Pokaż wszystkie
                    </button>
                </div>
            )}
        </div>
    )
}
