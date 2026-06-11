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

        const budgets = await prisma.budget.findMany({
            where: { userId },
            include: { category: true }
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

        if (month === undefined || typeof month !== "number" || month < 1 || month > 12) {
            return NextResponse.json(
                { error: "Nieprawidłowy miesiąc" },
                { status: 400 }
            )
        }

        if (year === undefined || typeof year !== "number" || year < 2000 || year > 2100) {
            return NextResponse.json(
                { error: "Nieprawidłowy rok" },
                { status: 400 }
            )
        }

        if (limitAmount === undefined || typeof limitAmount !== "number" || limitAmount <= 0) {
            return NextResponse.json(
                { error: "Kwota limitu musi być większa od zera" },
                { status: 400 }
            )
        }

        const existing = await prisma.budget.findFirst({
            where: {
                userId,
                month,
                year,
                categoryId: categoryId || null
            }
        })

        let budget
        if (existing) {
            budget = await prisma.budget.update({
                where: { id: existing.id },
                data: { limitAmount }
            })
        } else {
            budget = await prisma.budget.create({
                data: {
                    userId,
                    month,
                    year,
                    limitAmount,
                    categoryId: categoryId || null
                }
            })
        }

        return NextResponse.json(budget, { status: existing ? 200 : 201 })
    } catch {
        return NextResponse.json(
            { error: "Błąd serwera" },
            { status: 500 }
        )
    }
}
