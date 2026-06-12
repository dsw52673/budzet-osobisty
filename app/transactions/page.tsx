"use client"

import { useState } from "react"
import Sidebar from "../components/dashboard/Sidebar"
import BudgetAlert from "../components/dashboard/BudgetAlert"
import TransactionFilters from "../components/dashboard/TransactionFilters"
import TransactionTable from "../components/dashboard/TransactionTable"
import { useDashboard } from "../context/DashboardContext"

export default function TransactionsPage() {
    const {
        checkingToken,
        userEmail,
        expenses,
        categories,
        setIsExpenseModalOpen,
        setEditingExpenseId,
        setExpenseAmount,
        setExpenseCategoryId,
        setExpenseDescription,
        setExpenseDate
    } = useDashboard()

    const [searchTerm, setSearchTerm] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [selectedCategoryId, setSelectedCategoryId] = useState("")
    const [minAmount, setMinAmount] = useState("")
    const [maxAmount, setMaxAmount] = useState("")
    const [visibleCount, setVisibleCount] = useState(10)

    if (checkingToken) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#0a1120] p-4">
                <div className="animate-spin h-10 w-10 text-[#b5c7e3]" />
            </main>
        )
    }

    if (!userEmail) {
        return null
    }

    const filteredExpenses = expenses.filter((item) => {
        if (searchTerm && !item.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false
        }
        if (selectedCategoryId && item.categoryId !== selectedCategoryId) {
            return false
        }
        if (startDate && new Date(item.date) < new Date(startDate)) {
            return false
        }
        if (endDate && new Date(item.date) > new Date(endDate)) {
            return false
        }
        if (minAmount && Number(item.amount) < Number(minAmount)) {
            return false
        }
        if (maxAmount && Number(item.amount) > Number(maxAmount)) {
            return false
        }
        return true
    })

    const sortedExpenses = [...filteredExpenses].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const handleAddTransactionClick = () => {
        setEditingExpenseId(null)
        setExpenseAmount("")
        setExpenseDescription("")
        setExpenseDate(new Date().toISOString().split("T")[0])
        if (categories.length > 0) {
            setExpenseCategoryId(categories[0].id)
        }
        setIsExpenseModalOpen(true)
    }

    return (
        <main className="min-h-screen flex bg-[#0a1120] text-slate-100 font-sans">
            <Sidebar />

            <section className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <div className="p-6 md:p-10 space-y-8">
                    <BudgetAlert />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-white tracking-wide">Transakcje</h2>
                            <p className="text-slate-400 text-sm mt-1">Przeglądaj i zarządzaj swoimi przepływami pieniężnymi.</p>
                        </div>
                    </div>

                    <TransactionFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        selectedCategoryId={selectedCategoryId}
                        setSelectedCategoryId={setSelectedCategoryId}
                        minAmount={minAmount}
                        setMinAmount={setMinAmount}
                        maxAmount={maxAmount}
                        setMaxAmount={setMaxAmount}
                    />

                    <TransactionTable
                        sortedExpenses={sortedExpenses}
                        visibleCount={visibleCount}
                        setVisibleCount={setVisibleCount}
                    />
                </div>
            </section>
        </main>
    )
}
