"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "./components/dashboard/Sidebar"
import Header from "./components/dashboard/Header"
import BudgetAlert from "./components/dashboard/BudgetAlert"
import MonthlyOverview from "./components/dashboard/MonthlyOverview"
import LimitAndBudget from "./components/dashboard/LimitAndBudget"
import CategoryOverview from "./components/dashboard/CategoryOverview"
import RecentTransactions from "./components/dashboard/RecentTransactions"
import BudgetModal from "./components/dashboard/BudgetModal"
import ExpenseModal from "./components/dashboard/ExpenseModal"
import AllTransactionsModal from "./components/dashboard/AllTransactionsModal"
import { Category, Expense, Budget } from "./components/types"
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

  return (
    <main className="min-h-screen flex bg-[#0a1120] text-slate-100 font-sans">
      <Sidebar
        onAddExpenseClick={() => {
          setExpenseDate(new Date().toISOString().split("T")[0])
          setIsExpenseModalOpen(true)
        }}
        onLogout={handleLogout}
      />

      <section className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header availableFunds={availableFunds} totalExpenses={totalExpenses} />

        <div className="p-6 md:p-10 space-y-8">
          <BudgetAlert totalBudgetLimit={totalBudgetLimit} percentUsed={percentUsed} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <MonthlyOverview weeklyExpenses={weeklyExpenses} maxWeekly={maxWeekly} />

            <LimitAndBudget
              totalBudgetLimit={totalBudgetLimit}
              percentUsed={percentUsed}
              radius={radius}
              circumference={circumference}
              strokeDashoffset={strokeDashoffset}
              circleColor={circleColor}
              onEditLimitClick={() => {
                setBudgetLimit(totalBudgetLimit > 0 ? totalBudgetLimit.toString() : "")
                setIsBudgetModalOpen(true)
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CategoryOverview categoryList={categoryList} totalExpenses={totalExpenses} />

            <RecentTransactions
              recentTransactions={recentTransactions}
              onShowAllTransactionsClick={() => setIsAllTransactionsModalOpen(true)}
              formatDate={formatDate}
            />
          </div>
        </div>
      </section>

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        error={error}
        loading={loading}
        budgetLimit={budgetLimit}
        setBudgetLimit={setBudgetLimit}
        onSave={handleSaveBudget}
        onIncrement={incrementBudget}
        onDecrement={decrementBudget}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false)
          setIsCatDropdownOpen(false)
        }}
        error={error}
        loading={loading}
        expenseAmount={expenseAmount}
        setExpenseAmount={setExpenseAmount}
        expenseCategoryId={expenseCategoryId}
        setExpenseCategoryId={setExpenseCategoryId}
        expenseDescription={expenseDescription}
        setExpenseDescription={setExpenseDescription}
        expenseDate={expenseDate}
        setExpenseDate={setExpenseDate}
        categories={categories}
        isCatDropdownOpen={isCatDropdownOpen}
        setIsCatDropdownOpen={setIsCatDropdownOpen}
        onSave={handleAddExpense}
        onIncrementAmount={incrementAmount}
        onDecrementAmount={decrementAmount}
      />

      <AllTransactionsModal
        isOpen={isAllTransactionsModalOpen}
        onClose={() => setIsAllTransactionsModalOpen(false)}
        currentMonthExpenses={currentMonthExpenses}
        formatDate={formatDate}
        deletingId={deletingId}
        setDeletingId={setDeletingId}
        onDeleteExpense={handleDeleteExpense}
      />
    </main>
  )
}
