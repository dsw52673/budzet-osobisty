"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Category {
  id: string
  name: string
  isSystem: boolean
}

interface Expense {
  id: string
  amount: string | number
  date: string
  description: string | null
  categoryId: string
  category: Category
}

interface Budget {
  id: string
  month: number
  year: number
  limitAmount: string | number
  categoryId: string | null
}

export default function Home() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [checkingToken, setCheckingToken] = useState(true)

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isAllTransactionsModalOpen, setIsAllTransactionsModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [budgetLimit, setBudgetLimit] = useState("")
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expenseCategoryId, setExpenseCategoryId] = useState("")
  const [expenseDescription, setExpenseDescription] = useState("")
  const [expenseDate, setExpenseDate] = useState("")

  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const fetchData = useCallback(async () => {
    try {
      const [expensesRes, budgetsRes, categoriesRes] = await Promise.all([
        fetch("/api/expenses"),
        fetch("/api/budgets"),
        fetch("/api/categories")
      ])

      if (expensesRes.ok && budgetsRes.ok && categoriesRes.ok) {
        const expensesData = await expensesRes.json()
        const budgetsData = await budgetsRes.json()
        const categoriesData = await categoriesRes.json()

        setExpenses(expensesData)
        setBudgets(budgetsData)
        setCategories(categoriesData)

        if (categoriesData.length > 0) {
          setExpenseCategoryId(categoriesData[0].id)
        }
      }
    } catch { }
  }, [])

  useEffect(() => {
    const checkToken = () => {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop()?.split(";").shift()
        return null
      }

      const token = getCookie("token")
      if (token) {
        try {
          const payloadBase64 = token.split(".")[1]
          if (payloadBase64) {
            const decoded = JSON.parse(atob(payloadBase64))
            setUserEmail(decoded.email || "Użytkownik")
            fetchData()
          }
        } catch { }
      }
      setCheckingToken(false)
    }

    setTimeout(checkToken, 0)
  }, [fetchData])

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"
    setUserEmail(null)
    router.refresh()
  }

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          month: currentMonth,
          year: currentYear,
          limitAmount: Number(budgetLimit)
        })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Wystąpił błąd")
        setLoading(false)
        return
      }

      setIsBudgetModalOpen(false)
      setBudgetLimit("")
      setLoading(false)
      fetchData()
    } catch {
      setError("Błąd połączenia")
      setLoading(false)
    }
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: Number(expenseAmount),
          date: expenseDate ? new Date(expenseDate).toISOString() : new Date().toISOString(),
          categoryId: expenseCategoryId,
          description: expenseDescription
        })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Wystąpił błąd")
        setLoading(false)
        return
      }

      setIsExpenseModalOpen(false)
      setExpenseAmount("")
      setExpenseDescription("")
      setExpenseDate("")
      setLoading(false)
      fetchData()
    } catch {
      setError("Błąd połączenia")
      setLoading(false)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        setDeletingId(null)
        fetchData()
      }
    } catch { }
  }

  const incrementBudget = () => {
    const val = Number(budgetLimit) || 0
    setBudgetLimit((val + 100).toString())
  }

  const decrementBudget = () => {
    const val = Number(budgetLimit) || 0
    if (val >= 100) {
      setBudgetLimit((val - 100).toString())
    } else {
      setBudgetLimit("0")
    }
  }

  const incrementAmount = () => {
    const val = Number(expenseAmount) || 0
    setExpenseAmount((val + 1).toString())
  }

  const decrementAmount = () => {
    const val = Number(expenseAmount) || 0
    if (val >= 1) {
      setExpenseAmount((val - 1).toString())
    } else {
      setExpenseAmount("0")
    }
  }

  if (checkingToken) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a1120] p-4">
        <div className="animate-spin h-10 w-10 text-[#b5c7e3]" />
      </main>
    )
  }

  if (!userEmail) {
    router.push("/login")
    return null
  }

  const activeBudget = budgets.find(
    (b) => b.month === currentMonth && b.year === currentYear && b.categoryId === null
  )
  const totalBudgetLimit = activeBudget ? Number(activeBudget.limitAmount) : 0

  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date)
    return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear
  })

  const totalExpenses = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const availableFunds = totalBudgetLimit - totalExpenses
  const percentUsed = totalBudgetLimit > 0 ? (totalExpenses / totalBudgetLimit) * 100 : 0

  const weeklyExpenses = [0, 0, 0, 0]
  currentMonthExpenses.forEach((e) => {
    const d = new Date(e.date)
    const day = d.getDate()
    if (day <= 7) weeklyExpenses[0] += Number(e.amount)
    else if (day <= 14) weeklyExpenses[1] += Number(e.amount)
    else if (day <= 21) weeklyExpenses[2] += Number(e.amount)
    else weeklyExpenses[3] += Number(e.amount)
  })
  const maxWeekly = Math.max(...weeklyExpenses, 1)

  const categoryMap: { [key: string]: { amount: number; name: string } } = {}
  currentMonthExpenses.forEach((e) => {
    const catName = e.category?.name || "Inne"
    if (!categoryMap[catName]) {
      categoryMap[catName] = { amount: 0, name: catName }
    }
    categoryMap[catName].amount += Number(e.amount)
  })
  const categoryList = Object.values(categoryMap).sort((a, b) => b.amount - a.amount)

  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(percentUsed, 100) / 100) * circumference

  let circleColor = "stroke-[#b5c7e3]"
  if (percentUsed >= 100) {
    circleColor = "stroke-red-500"
  } else if (percentUsed >= 80) {
    circleColor = "stroke-yellow-500"
  }

  const recentTransactions = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (d.toDateString() === today.toDateString()) {
      return "Dziś"
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "Wczoraj"
    }

    const months = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"]
    return `${d.getDate()} ${months[d.getMonth()]}`
  }

  const selectedCategory = categories.find((c) => c.id === expenseCategoryId)

  return (
    <main className="min-h-screen flex bg-[#0a1120] text-slate-100 font-sans">
      <aside className="hidden md:flex flex-col w-64 bg-[#131b2e] border-r border-slate-800/40 p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#1b253b] rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V11M12 21V11M5 21V11M3 11h18M3 21h18M12 3L3 7h18l-9-4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-none">Budget</h2>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 bg-[#252f48] text-white rounded-xl font-medium transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboard</span>
          </Link>
        </nav>

        <button
          onClick={() => {
            setExpenseDate(new Date().toISOString().split("T")[0])
            setIsExpenseModalOpen(true)
          }}
          className="w-full py-3.5 mb-6 bg-[#b5c7e3] hover:bg-[#a7b9d5] text-[#0a1120] font-bold rounded-xl shadow-lg shadow-[#b5c7e3]/10 cursor-pointer flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Dodaj wydatek</span>
        </button>

        <div className="border-t border-slate-800/60 pt-6 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 rounded-xl transition-colors cursor-pointer text-left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Wyloguj się</span>
          </button>
        </div>
      </aside>

      <section className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 md:p-10 border-b border-slate-800/40">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">Dzień dobry</h1>
            <p className="text-slate-400 text-sm mt-1">Oto Twoje podsumowanie finansowe na ten miesiąc.</p>
          </div>

          <div className="flex gap-4 w-full sm:w-auto">
            <div className="bg-[#1b253b] border border-slate-800/40 px-6 py-3 rounded-2xl flex-1 sm:flex-none">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Dostępne środki</span>
              <span className={`text-lg sm:text-xl font-extrabold ${availableFunds >= 0 ? "text-white" : "text-red-400"}`}>
                {availableFunds.toFixed(2)} PLN
              </span>
            </div>
            <div className="bg-[#1b253b] border border-slate-800/40 px-6 py-3 rounded-2xl flex-1 sm:flex-none">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Wydatki</span>
              <span className="text-lg sm:text-xl font-extrabold text-white">
                {totalExpenses.toFixed(2)} PLN
              </span>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 space-y-8">
          {totalBudgetLimit > 0 && percentUsed >= 80 && (
            <div className={`border rounded-2xl p-5 flex items-start gap-4 ${percentUsed >= 100 ? "bg-red-500/10 border-red-500/20 text-red-200" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-200"}`}>
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  {percentUsed >= 100 ? "Przekroczono limit budżetu!" : "Zbliżasz się do limitu budżetu"}
                </h3>
                <p className="text-xs sm:text-sm mt-1 opacity-90">
                  Twoje obecne wydatki osiągnęły <span className="font-bold">{percentUsed.toFixed(0)}%</span> zaplanowanego budżetu na ten miesiąc.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                onClick={() => {
                  setBudgetLimit(totalBudgetLimit > 0 ? totalBudgetLimit.toString() : "")
                  setIsBudgetModalOpen(true)
                }}
                className="w-full mt-6 py-3 bg-[#252f48] hover:bg-[#2e3b5a] text-slate-200 font-semibold rounded-2xl transition-all cursor-pointer text-sm"
              >
                {totalBudgetLimit > 0 ? "Edytuj limit" : "Ustaw limit"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#1b253b] border border-slate-800/40 rounded-[2rem] p-6 sm:p-8 flex flex-col">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-6">Wydatki wg Kategorii</h3>

              {categoryList.length > 0 ? (
                <div className="flex-1 space-y-4">
                  {categoryList.map((item, idx) => {
                    const percent = (item.amount / totalExpenses) * 100
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
                          <td className="py-4 text-right font-black text-white">-{Number(item.amount).toFixed(2)} PLN</td>
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
          </div>
        </div>
      </section>

      {isBudgetModalOpen && (
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
                  <div className="absolute inset-y-0 right-0 flex flex-col w-10 border-l border-slate-700/40">
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
      )}

      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1120]/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#1b253b] border border-slate-800/40 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Dodaj nowy wydatek</h3>
              <button
                onClick={() => {
                  setIsExpenseModalOpen(false)
                  setIsCatDropdownOpen(false)
                }}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
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

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label htmlFor="expense-amount-input" className="block text-xs font-bold text-slate-405 uppercase tracking-wider mb-2">Kwota (PLN)</label>
                <div className="relative">
                  <input
                    id="expense-amount-input"
                    type="number"
                    required
                    min="0.01"
                    step="any"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full pl-4 pr-12 py-3.5 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="np. 24.50"
                  />
                  <div className="absolute inset-y-0 right-0 flex flex-col w-10 border-l border-slate-700/40">
                    <button
                      type="button"
                      onClick={incrementAmount}
                      className="flex-1 flex items-center justify-center hover:bg-slate-700/40 text-slate-400 hover:text-white rounded-tr-2xl transition-colors cursor-pointer border-b border-slate-700/45"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={decrementAmount}
                      className="flex-1 flex items-center justify-center hover:bg-slate-700/40 text-slate-400 hover:text-white rounded-br-2xl transition-colors cursor-pointer"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-405 uppercase tracking-wider mb-2">Kategoria</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                    className="w-full px-4 py-3.5 bg-[#252f48] border border-transparent rounded-2xl text-left text-white focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm cursor-pointer flex justify-between items-center"
                  >
                    <span>{selectedCategory ? selectedCategory.name : "Wybierz kategorię"}</span>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${isCatDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {isCatDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-[#252f48] border border-slate-700/80 rounded-2xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar p-1 divide-y divide-slate-700/30">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setExpenseCategoryId(cat.id)
                            setIsCatDropdownOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50 hover:text-white rounded-xl transition-colors cursor-pointer"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="expense-desc-input" className="block text-xs font-bold text-slate-405 uppercase tracking-wider mb-2">Opis (opcjonalny)</label>
                <input
                  id="expense-desc-input"
                  type="text"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  placeholder="np. Zakupy w Biedronce"
                />
              </div>

              <div>
                <label htmlFor="expense-date-input" className="block text-xs font-bold text-slate-405 uppercase tracking-wider mb-2">Data</label>
                <input
                  id="expense-date-input"
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 bg-[#b5c7e3] hover:bg-[#a7b9d5] active:bg-[#99acca] text-[#0a1120] font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#b5c7e3]/10"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-[#0a1120] border-t-transparent rounded-full" />
                ) : "Dodaj wydatek"}
              </button>
            </form>
          </div>
        </div>
      )}

      {isAllTransactionsModalOpen && (
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
      )}
    </main>
  )
}
