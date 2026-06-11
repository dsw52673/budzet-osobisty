import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../lib/prisma"

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

        const where: any = { userId }

        if (monthParam) {
            const m = parseInt(monthParam, 10)
            if (isNaN(m) || m < 1 || m > 12) {
                return NextResponse.json(
                    { error: "Nieprawidłowy miesiąc" },
                    { status: 400 }
                )
            }
            where.month = m
        }

        if (yearParam) {
            const y = parseInt(yearParam, 10)
            if (isNaN(y)) {
                return NextResponse.json(
                    { error: "Nieprawidłowy rok" },
                    { status: 400 }
                )
            }
            where.year = y
        }

        const budgets = await prisma.budget.findMany({
            where,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                category: true
            }
        })

        return NextResponse.json(budgets, { status: 200 })
    } catch {
        return NextResponse.json(
            { error: "Błąd serwera" },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id")
        if (!userId) {
            return NextResponse.json(
                { error: "Brak autoryzacji" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { month, year, limitAmount, categoryId } = body

        if (month === undefined || month === null || typeof month !== "number" || month < 1 || month > 12) {
            return NextResponse.json(
                { error: "Miesiąc musi być liczbą od 1 do 12" },
                { status: 400 }
            )
        }

        if (year === undefined || year === null || typeof year !== "number") {
            return NextResponse.json(
                { error: "Rok musi być liczbą" },
                { status: 400 }
            )
        }

        if (limitAmount === undefined || limitAmount === null || typeof limitAmount !== "number" || limitAmount <= 0) {
            return NextResponse.json(
                { error: "Kwota limitu musi być liczbą większą od zera" },
                { status: 400 }
            )
        }

        if (categoryId !== undefined && categoryId !== null) {
            if (typeof categoryId !== "string") {
                return NextResponse.json(
                    { error: "Nieprawidłowy identyfikator kategorii" },
                    { status: 400 }
                )
            }

            const category = await prisma.category.findFirst({
                where: {
                    id: categoryId,
                    OR: [
                        { isSystem: true },
                        { userId }
                    ]
                }
            })

            if (!category) {
                return NextResponse.json(
                    { error: "Wybrana kategoria nie istnieje" },
                    { status: 400 }
                )
            }
        }

        const targetCategoryId = categoryId || null

        const existingBudget = await prisma.budget.findFirst({
            where: {
                userId,
                month,
                year,
                categoryId: targetCategoryId
            }
        })

        let budget
        if (existingBudget) {
            budget = await prisma.budget.update({
                where: { id: existingBudget.id },
                data: { limitAmount },
                include: { category: true }
            })
        } else {
            budget = await prisma.budget.create({
                data: {
                    userId,
                    month,
                    year,
                    limitAmount,
                    categoryId: targetCategoryId
                },
                include: { category: true }
            })
        }

        return NextResponse.json(budget, { status: existingBudget ? 200 : 201 })
    } catch {
        return NextResponse.json(
            { error: "Błąd serwera" },
            { status: 500 }
        )
    }
}
