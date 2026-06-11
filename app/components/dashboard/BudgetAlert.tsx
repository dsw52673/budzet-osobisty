interface BudgetAlertProps {
  totalBudgetLimit: number
  percentUsed: number
}

export default function BudgetAlert({ totalBudgetLimit, percentUsed }: BudgetAlertProps) {
  if (totalBudgetLimit <= 0 || percentUsed < 80) {
    return null
  }

  const isExceeded = percentUsed >= 100

  return (
    <div className={`border rounded-2xl p-5 flex items-start gap-4 ${isExceeded ? "bg-red-500/10 border-red-500/20 text-red-200" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-200"}`}>
      <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <h3 className="font-bold text-sm sm:text-base">
          {isExceeded ? "Przekroczono limit budżetu!" : "Zbliżasz się do limitu budżetu"}
        </h3>
        <p className="text-xs sm:text-sm mt-1 opacity-90">
          Twoje obecne wydatki osiągnęły <span className="font-bold">{percentUsed.toFixed(0)}%</span> zaplanowanego budżetu na ten miesiąc.
        </p>
      </div>
    </div>
  )
}
