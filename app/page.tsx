"use client"

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
import { DashboardProvider, useDashboard } from "./context/DashboardContext"

function DashboardContent() {
    const { checkingToken, userEmail } = useDashboard()

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

    return (
        <main className="min-h-screen flex bg-[#0a1120] text-slate-100 font-sans">
            <Sidebar />

            <section className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <Header />

                <div className="p-6 md:p-10 space-y-8">
                    <BudgetAlert />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <MonthlyOverview />
                        <LimitAndBudget />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <CategoryOverview />
                        <RecentTransactions />
                    </div>
                </div>
            </section>

            <BudgetModal />
            <ExpenseModal />
            <AllTransactionsModal />
        </main>
    )
}

export default function Home() {
    return (
        <DashboardProvider>
            <DashboardContent />
        </DashboardProvider>
    )
}
