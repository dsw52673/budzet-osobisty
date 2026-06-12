import { useDashboard } from "../../context/DashboardContext"

export default function CategoryOverview() {
    const { categoryList, totalExpenses } = useDashboard()

    return (
        <div className="bg-[#1b253b] border border-slate-800/40 rounded-[2rem] p-6 sm:p-8 flex flex-col">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6">Wydatki wg Kategorii</h3>

            {categoryList.length > 0 ? (
                <div className="flex-1 space-y-4">
                    {categoryList.map((item, idx) => {
                        const percent = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0
                        const colors = ["bg-[#67bffe]", "bg-[#34aafe]", "bg-[#4796b8]", "bg-[#3ba2c4]"]
                        const colorClass = colors[idx % colors.length]
                        return (
                            <div key={item.name} className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                                        <span className="font-medium text-slate-200">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-slate-400">{percent.toFixed(0)}% ({item.amount.toFixed(0)} zł)</span>
                                </div>
                                <div className="w-full bg-[#252f48] h-2 rounded-full overflow-hidden">
                                    <div style={{ width: `${percent}%` }} className={`h-full ${colorClass} rounded-full`} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                    <span className="text-sm text-slate-400">Brak zarejestrowanych wydatków w tym miesiącu.</span>
                </div>
            )}
        </div>
    )
}
