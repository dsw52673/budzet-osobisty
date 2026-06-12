import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "../../../lib/prisma"
import { getExchangeRate } from "../../../lib/services/exchangeRates"

const SUPPORTED_CURRENCIES = ["PLN", "EUR", "USD", "GBP", "CHF", "NOK"]

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = req.headers.get("x-user-id")
        if (!userId) {
            return NextResponse.json(
                { error: "Brak autoryzacji" },
                { status: 401 }
            )
        }

        const { id } = await params

        const expense = await prisma.expense.findUnique({
            where: { id },
            include: {
                category: true
            }
        })

        if (!expense) {
            return NextResponse.json(
                { error: "Wydatek nie istnieje" },
                { status: 404 }
            )
        }

        if (expense.userId !== userId) {
            return NextResponse.json(
                { error: "Brak uprawnień do wyświetlenia tego wydatku" },
                { status: 403 }
            )
        }

        return NextResponse.json(expense, { status: 200 })
    } catch {
        return NextResponse.json(
            { error: "Błąd serwera" },
            { status: 500 }
        )
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = req.headers.get("x-user-id")
        if (!userId) {
            return NextResponse.json(
                { error: "Brak autoryzacji" },
                { status: 401 }
            )
        }

        const { id } = await params

        const expense = await prisma.expense.findUnique({
            where: { id }
        })

        if (!expense) {
            return NextResponse.json(
                { error: "Wydatek nie istnieje" },
                { status: 404 }
            )
        }

        if (expense.userId !== userId) {
            return NextResponse.json(
                { error: "Brak uprawnień do edycji tego wydatku" },
                { status: 403 }
            )
        }

        const body = await req.json()
        const { amount, date, categoryId, description, currency } = body
        const updateData: Prisma.ExpenseUncheckedUpdateInput = {}

        if (amount !== undefined) {
            if (typeof amount !== "number" || amount <= 0) {
                return NextResponse.json(
                    { error: "Kwota musi być liczbą większą od zera" },
                    { status: 400 }
                )
            }
            updateData.amount = amount
        }

        if (date !== undefined) {
            if (!date || isNaN(Date.parse(date))) {
                return NextResponse.json(
                    { error: "Nieprawidłowa data" },
                    { status: 400 }
                )
            }
            updateData.date = new Date(date)
        }

        if (categoryId !== undefined) {
            if (!categoryId || typeof categoryId !== "string") {
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
            updateData.categoryId = categoryId
        }

        if (description !== undefined) {
            if (description !== null && typeof description !== "string") {
                return NextResponse.json(
                    { error: "Opis musi być tekstem" },
                    { status: 400 }
                )
            }
            updateData.description = description || null
        }

        if (currency !== undefined) {
            if (typeof currency !== "string" || !SUPPORTED_CURRENCIES.includes(currency.toUpperCase())) {
                return NextResponse.json(
                    { error: "Nieobsługiwana waluta" },
                    { status: 400 }
                )
            }
        }

        if (amount !== undefined || date !== undefined || currency !== undefined) {
            const finalAmount = amount !== undefined ? amount : Number(expense.amount)
            const finalCurrency = currency !== undefined ? currency.toUpperCase() : expense.currency
            const finalDate = date !== undefined ? new Date(date) : new Date(expense.date)

            let rate = 1.0
            if (finalCurrency !== "PLN") {
                try {
                    rate = await getExchangeRate(finalCurrency, finalDate.toISOString())
                } catch {
                    return NextResponse.json(
                        { error: "Nie udało się pobrać kursu waluty" },
                        { status: 400 }
                    )
                }
            }

            updateData.currency = finalCurrency
            updateData.exchangeRate = rate
            updateData.amountInBase = Number((finalAmount * rate).toFixed(2))
        }

        const updatedExpense = await prisma.expense.update({
            where: { id },
            data: updateData,
            include: {
                category: true
            }
        })

        return NextResponse.json(updatedExpense, { status: 200 })
    } catch {
        return NextResponse.json(
            { error: "Błąd serwera" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = req.headers.get("x-user-id")
        if (!userId) {
            return NextResponse.json(
                { error: "Brak autoryzacji" },
                { status: 401 }
            )
        }

        const { id } = await params

        const expense = await prisma.expense.findUnique({
            where: { id }
        })

        if (!expense) {
            return NextResponse.json(
                { error: "Wydatek nie istnieje" },
                { status: 404 }
            )
        }

        if (expense.userId !== userId) {
            return NextResponse.json(
                { error: "Brak uprawnień do usunięcia tego wydatku" },
                { status: 403 }
            )
        }

        await prisma.expense.delete({
            where: { id }
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch {
        return NextResponse.json(
            { error: "Błąd serwera" },
            { status: 500 }
        )
    }
}
