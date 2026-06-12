import { useState, useEffect, useCallback } from "react"
import { Category, Expense, Budget } from "../lib/types"

export function useDashboardData() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
    const [isAllTransactionsModalOpen, setIsAllTransactionsModalOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)

    const [budgetLimit, setBudgetLimit] = useState("")
    const [expenseAmount, setExpenseAmount] = useState("")
    const [expenseCategoryId, setExpenseCategoryId] = useState("")
    const [expenseDescription, setExpenseDescription] = useState("")
    const [expenseDate, setExpenseDate] = useState("")
    const [expenseCurrency, setExpenseCurrency] = useState("PLN")

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
        fetchData()
    }, [fetchData])

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
                    description: expenseDescription,
                    currency: expenseCurrency
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
            setExpenseCurrency("PLN")
            setLoading(false)
            fetchData()
        } catch {
            setError("Błąd połączenia")
            setLoading(false)
        }
    }

    const handleEditExpense = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingExpenseId) return
        setError("")
        setLoading(true)

        try {
            const res = await fetch(`/api/expenses/${editingExpenseId}`, {
                method: "PUT",
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
            setEditingExpenseId(null)
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

    return {
        expenses,
        budgets,
        categories,
        isBudgetModalOpen,
        setIsBudgetModalOpen,
        isExpenseModalOpen,
        setIsExpenseModalOpen,
        isAllTransactionsModalOpen,
        setIsAllTransactionsModalOpen,
        deletingId,
        setDeletingId,
        editingExpenseId,
        setEditingExpenseId,
        budgetLimit,
        setBudgetLimit,
        expenseAmount,
        setExpenseAmount,
        expenseCategoryId,
        setExpenseCategoryId,
        expenseDescription,
        setExpenseDescription,
        expenseDate,
        setExpenseDate,
        expenseCurrency,
        setExpenseCurrency,
        isCatDropdownOpen,
        setIsCatDropdownOpen,
        error,
        setError,
        loading,
        currentMonth,
        currentYear,
        handleSaveBudget,
        handleAddExpense,
        handleEditExpense,
        handleDeleteExpense,
        incrementBudget,
        decrementBudget,
        incrementAmount,
        decrementAmount,
    }
}
