"use client"

import { createContext, useContext, ReactNode } from "react"
import { useAuth } from "../hooks/useAuth"
import { useDashboardData } from "../hooks/useDashboardData"
import {
    calculateDashboardStats,
    calculateWeeklyOverview,
    groupExpensesByCategory,
    calculateSvgProgress
} from "../lib/utils/dashboard"
import { Category, Expense, Budget } from "../lib/types"

interface DashboardContextType {
    userEmail: string | null
    checkingToken: boolean
    handleLogout: () => void

    expenses: Expense[]
    budgets: Budget[]
    categories: Category[]
    isBudgetModalOpen: boolean
    setIsBudgetModalOpen: (open: boolean) => void
    isExpenseModalOpen: boolean
    setIsExpenseModalOpen: (open: boolean) => void
    isAllTransactionsModalOpen: boolean
    setIsAllTransactionsModalOpen: (open: boolean) => void
    deletingId: string | null
    setDeletingId: (id: string | null) => void
    budgetLimit: string
    setBudgetLimit: (limit: string) => void
    expenseAmount: string
    setExpenseAmount: (amount: string) => void
    expenseCategoryId: string
    setExpenseCategoryId: (id: string) => void
    expenseDescription: string
    setExpenseDescription: (desc: string) => void
    expenseDate: string
    setExpenseDate: (date: string) => void
    isCatDropdownOpen: boolean
    setIsCatDropdownOpen: (open: boolean) => void
    error: string
    setError: (err: string) => void
    loading: boolean
    currentMonth: number
    currentYear: number

    // Computed values
    totalBudgetLimit: number
    currentMonthExpenses: Expense[]
    totalExpenses: number
    availableFunds: number
    percentUsed: number
    weeklyExpenses: number[]
    maxWeekly: number
    categoryList: { amount: number; name: string }[]
    svgProgress: {
        radius: number
        circumference: number
        strokeDashoffset: number
        circleColor: string
    }
    recentTransactions: Expense[]

    // Actions
    handleSaveBudget: (e: React.FormEvent) => Promise<void>
    handleAddExpense: (e: React.FormEvent) => Promise<void>
    handleDeleteExpense: (id: string) => Promise<void>
    incrementBudget: () => void
    decrementBudget: () => void
    incrementAmount: () => void
    decrementAmount: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
    const auth = useAuth()
    const dashboard = useDashboardData()

    const {
        totalBudgetLimit,
        currentMonthExpenses,
        totalExpenses,
        availableFunds,
        percentUsed
    } = calculateDashboardStats(
        dashboard.expenses,
        dashboard.budgets,
        dashboard.currentMonth,
        dashboard.currentYear
    )

    const { weeklyExpenses, maxWeekly } = calculateWeeklyOverview(currentMonthExpenses)
    const categoryList = groupExpensesByCategory(currentMonthExpenses)
    const svgProgress = calculateSvgProgress(percentUsed)
    const recentTransactions = [...dashboard.expenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

    const value: DashboardContextType = {
        ...auth,
        ...dashboard,
        totalBudgetLimit,
        currentMonthExpenses,
        totalExpenses,
        availableFunds,
        percentUsed,
        weeklyExpenses,
        maxWeekly,
        categoryList,
        svgProgress,
        recentTransactions,
    }

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    )
}

export function useDashboard() {
    const context = useContext(DashboardContext)
    if (!context) {
        throw new Error("useDashboard must be used within a DashboardProvider")
    }
    return context
}
