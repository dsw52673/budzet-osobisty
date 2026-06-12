import { Expense, Budget } from "../types"

export function formatDate(dateStr: string) {
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

export function calculateDashboardStats(
    expenses: Expense[],
    budgets: Budget[],
    currentMonth: number,
    currentYear: number
) {
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

    return {
        totalBudgetLimit,
        currentMonthExpenses,
        totalExpenses,
        availableFunds,
        percentUsed,
    }
}

export function calculateWeeklyOverview(currentMonthExpenses: Expense[]) {
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
    return {
        weeklyExpenses,
        maxWeekly,
    }
}

export function groupExpensesByCategory(currentMonthExpenses: Expense[]) {
    const categoryMap: { [key: string]: { amount: number; name: string } } = {}
    currentMonthExpenses.forEach((e) => {
        const catName = e.category?.name || "Inne"
        if (!categoryMap[catName]) {
            categoryMap[catName] = { amount: 0, name: catName }
        }
        categoryMap[catName].amount += Number(e.amount)
    })
    return Object.values(categoryMap).sort((a, b) => b.amount - a.amount)
}

export function calculateSvgProgress(percentUsed: number, radius: number = 50) {
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (Math.min(percentUsed, 100) / 100) * circumference

    let circleColor = "stroke-[#b5c7e3]"
    if (percentUsed >= 100) {
        circleColor = "stroke-red-500"
    } else if (percentUsed >= 80) {
        circleColor = "stroke-yellow-500"
    }

    return {
        radius,
        circumference,
        strokeDashoffset,
        circleColor,
    }
}
