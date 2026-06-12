import { useState } from "react"
import { useDashboard } from "../../context/DashboardContext"

export default function MonthlyOverview() {
    const { expenses, currentMonth, currentYear } = useDashboard()

    const [selectedMonth, setSelectedMonth] = useState(currentMonth)
    const [selectedYear, setSelectedYear] = useState(currentYear)

    const monthNames = [
        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ]
    const monthNamesShort = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"]
    const weekDays = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"]

    const selectedMonthName = monthNames[selectedMonth - 1]

    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1)
    let startDayOfWeek = firstDayOfMonth.getDay()
    if (startDayOfWeek === 0) startDayOfWeek = 7
    const emptyDays = startDayOfWeek - 1

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()

    const dailyExpenses: { [day: number]: number } = {}
    for (let i = 1; i <= daysInMonth; i++) {
        dailyExpenses[i] = 0
    }

    const filteredExpenses = expenses.filter((e) => {
        const d = new Date(e.date)
        return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear
    })

    filteredExpenses.forEach((e) => {
        const d = new Date(e.date)
        const day = d.getDate()
        const amount = e.amountInBase !== undefined && e.amountInBase !== null ? Number(e.amountInBase) : Number(e.amount)
        dailyExpenses[day] = (dailyExpenses[day] || 0) + amount
    })

    const maxDaily = Math.max(...Object.values(dailyExpenses), 0)

    const getDayStyle = (amount: number) => {
        if (amount === 0) {
            return "bg-[#131b2e]/45 border border-slate-800/30 text-slate-500 hover:border-slate-700/50"
        }
        const intensity = maxDaily > 0 ? (amount / maxDaily) : 0
        if (intensity <= 0.25) {
            return "bg-red-950/30 border border-red-900/20 text-red-400/80 hover:border-red-900/50"
        }
        if (intensity <= 0.5) {
            return "bg-red-900/30 border border-red-800/30 text-red-300 hover:border-red-800/60"
        }
        if (intensity <= 0.75) {
            return "bg-red-800/40 border border-red-700/40 text-red-200 hover:border-red-700/70"
        }
        return "bg-red-500 text-white font-black hover:bg-red-400 shadow-md shadow-red-600/10"
    }

    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12)
            setSelectedYear(selectedYear - 1)
        } else {
            setSelectedMonth(selectedMonth - 1)
        }
    }

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1)
            setSelectedYear(selectedYear + 1)
        } else {
            setSelectedMonth(selectedMonth + 1)
        }
    }

    return (
        <div className="bg-[#1b253b] border border-slate-800/40 rounded-[2rem] p-6 sm:p-8 lg:p-4 xl:p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6 lg:mb-3 xl:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">Przegląd Miesięczny</h3>
                <div className="flex items-center gap-1.5 bg-[#0a1120]/40 p-1.5 rounded-xl border border-slate-800/30">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-[#252f48] text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
                        title="Poprzedni miesiąc"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider select-none px-1">
                        {selectedMonthName} {selectedYear}
                    </span>
                    <button
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-[#252f48] text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
                        title="Następny miesiąc"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-[420px] lg:max-w-[280px] xl:max-w-[320px]">
                    <div className="grid grid-cols-7 gap-2 lg:gap-1 xl:gap-1.5 mb-2 text-center text-xs font-bold text-slate-400">
                        {weekDays.map((wd) => (
                            <div key={wd} className="py-1">
                                {wd}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 lg:gap-1 xl:gap-1.5">
                        {Array.from({ length: emptyDays }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="aspect-square" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                            const day = idx + 1
                            const amount = dailyExpenses[day] || 0
                            return (
                                <div
                                    key={`day-${day}`}
                                    className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all relative group cursor-pointer ${getDayStyle(amount)}`}
                                >
                                    <span>{day}</span>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 bg-[#0a1120] border border-slate-800 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-slate-200 whitespace-nowrap shadow-xl">
                                        {day} {monthNamesShort[selectedMonth - 1]}: {amount.toFixed(2)} PLN
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
