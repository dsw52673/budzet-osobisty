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
        const categoryId = searchParams.get("categoryId")
        const startDate = searchParams.get("startDate")
        const endDate = searchParams.get("endDate")
        const minAmount = searchParams.get("minAmount")
        const maxAmount = searchParams.get("maxAmount")

        const where: any = { userId }

        if (categoryId) {
            where.categoryId = categoryId
        }

        if (startDate || endDate) {
            where.date = {}
            if (startDate && !isNaN(Date.parse(startDate))) {
                where.date.gte = new Date(startDate)
            }
            if (endDate && !isNaN(Date.parse(endDate))) {
                where.date.lte = new Date(endDate)
            }
        }

        if (minAmount || maxAmount) {
            where.amount = {}
            if (minAmount && !isNaN(Number(minAmount))) {
                where.amount.gte = Number(minAmount)
            }
            if (maxAmount && !isNaN(Number(maxAmount))) {
                where.amount.lte = Number(maxAmount)
            }
        }

        const expenses = await prisma.expense.findMany({
            where,
            orderBy: {
                date: "desc"
            },
            include: {
                category: true
            }
        })

        return NextResponse.json(expenses, { status: 200 })
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
        const { amount, date, categoryId, description } = body

        if (amount === undefined || amount === null || typeof amount !== "number" || amount <= 0) {
            return NextResponse.json(
                { error: "Kwota musi być liczbą większą od zera" },
                { status: 400 }
            )
        }

        if (!date || isNaN(Date.parse(date))) {
            return NextResponse.json(
                { error: "Nieprawidłowa data" },
                { status: 400 }
            )
        }

        if (!categoryId || typeof categoryId !== "string") {
            return NextResponse.json(
                { error: "Kategoria jest wymagana" },
                { status: 400 }
            )
        }

        if (description !== undefined && description !== null && typeof description !== "string") {
            return NextResponse.json(
                { error: "Opis musi być tekstem" },
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

        const expense = await prisma.expense.create({
            data: {
                amount,
                date: new Date(date),
                categoryId,
                userId,
                description: description || null
            },
            include: {
                category: true
            }
        })

        return NextResponse.json(expense, { status: 201 })
    } catch {
        return NextResponse.json(
            { error: "Błąd serwera" },
            { status: 500 }
        )
    }
}
