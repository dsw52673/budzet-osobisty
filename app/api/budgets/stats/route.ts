import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id")
        if (!userId) {
            return NextResponse.json(
                { error: "Brak autoryzacji" },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(req.url)
        const monthParam = searchParams.get("month")
        const yearParam = searchParams.get("year")

        const now = new Date()
        let month = now.getMonth() + 1
        let year = now.getFullYear()

        if (monthParam) {
            const m = parseInt(monthParam, 10)
            if (isNaN(m) || m < 1 || m > 12) {
                return NextResponse.json(
                    { error: "Nieprawidłowy miesiąc" },
                    { status: 400 }
                )
            }
            month = m
        }

        if (yearParam) {
            const y = parseInt(yearParam, 10)
            if (isNaN(y)) {
                return NextResponse.json(
                    { error: "Nieprawidłowy rok" },
                    { status: 400 }
                )
            }
            year = y
        }

        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 1)

        const [budgets, expenses, categories] = await Promise.all([
            prisma.budget.findMany({
                where: {
                    userId,
                    month,
                    year
                }
            }),
            prisma.expense.findMany({
                where: {
                    userId,
                    date: {
                        gte: startDate,
                        lt: endDate
                    }
                }
            }),
            prisma.category.findMany({
                where: {
                    OR: [
                        { isSystem: true },
                        { userId }
                    ]
                }
            })
        ])

        const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amountInBase), 0)

        const generalBudget = budgets.find(b => b.categoryId === null)
        const totalBudget = generalBudget ? Number(generalBudget.limitAmount) : null
        const percentage = totalBudget ? Number(((totalSpent / totalBudget) * 100).toFixed(2)) : null

        const categoryStats = categories.map(category => {
            const catExpenses = expenses.filter(e => e.categoryId === category.id)
            const spent = catExpenses.reduce((sum, exp) => sum + Number(exp.amountInBase), 0)

            const catBudgetObj = budgets.find(b => b.categoryId === category.id)
            const budget = catBudgetObj ? Number(catBudgetObj.limitAmount) : null

            const percentageOfCategoryBudget = budget ? Number(((spent / budget) * 100).toFixed(2)) : null
            const percentageOfTotalSpent = totalSpent > 0 ? Number(((spent / totalSpent) * 100).toFixed(2)) : 0

            return {
                categoryId: category.id,
                categoryName: category.name,
                spent,
                budget,
                percentageOfCategoryBudget,
                percentageOfTotalSpent
            }
        })

        categoryStats.sort((a, b) => b.spent - a.spent)

        return NextResponse.json({
            month,
            year,
            totalSpent,
            totalBudget,
            percentage,
            categories: categoryStats
        }, { status: 200 })
    } catch {
        return NextResponse.json(
            { error: "Błąd serwera" },
            { status: 500 }
        )
    }
}
