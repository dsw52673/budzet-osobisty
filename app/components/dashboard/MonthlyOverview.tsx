interface MonthlyOverviewProps {
  weeklyExpenses: number[]
  maxWeekly: number
}

export default function MonthlyOverview({ weeklyExpenses, maxWeekly }: MonthlyOverviewProps) {
  return (
    <div className="lg:col-span-2 bg-[#1b253b] border border-slate-800/40 rounded-[2rem] p-6 sm:p-8 flex flex-col">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-6">Miesięczny Przegląd</h3>

      <div className="flex-1 flex items-end justify-between gap-4 h-56 px-4 pb-4 border-b border-slate-800/60">
        {weeklyExpenses.map((val, idx) => {
          const heightPercent = (val / maxWeekly) * 100
          return (
            <div key={idx} className="flex-1 flex flex-col items-center group">
              <div className="relative w-full flex justify-center">
                <span className="absolute -top-8 bg-[#131b2e] border border-slate-800 text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  {val.toFixed(2)} PLN
                </span>
              </div>
              <div className="w-8 sm:w-12 bg-[#252f48] rounded-t-xl h-48 flex flex-col justify-end overflow-hidden">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-sky-blue-light-600 to-sky-blue-light-400 rounded-t-xl transition-all duration-500"
                />
              </div>
              <span className="text-xs text-slate-400 mt-3 font-semibold">Tydz {idx + 1}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
