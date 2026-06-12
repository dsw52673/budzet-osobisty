"use client"

import Sidebar from "./components/dashboard/Sidebar"
import BudgetAlert from "./components/dashboard/BudgetAlert"
import MonthlyOverview from "./components/dashboard/MonthlyOverview"
import LimitAndBudget from "./components/dashboard/LimitAndBudget"
import CategoryOverview from "./components/dashboard/CategoryOverview"
import RecentTransactions from "./components/dashboard/RecentTransactions"
import { useDashboard } from "./context/DashboardContext"

export default function Home() {
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
        <main className="min-h-screen lg:h-screen flex bg-[#0a1120] text-slate-100 font-sans lg:overflow-hidden">
            <Sidebar />

            <section className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto lg:overflow-hidden">
                <div className="flex-1 flex flex-col p-6 md:p-8 lg:p-6 space-y-6 lg:space-y-5 xl:space-y-6 min-h-0">
                    <BudgetAlert />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 lg:flex-[1.3] lg:min-h-0">
                        <MonthlyOverview />
                        <LimitAndBudget />
                        <CategoryOverview />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 lg:flex-1 lg:min-h-0">
                        <RecentTransactions />
                    </div>
                </div>
            </section>
        </main>
    )
}
