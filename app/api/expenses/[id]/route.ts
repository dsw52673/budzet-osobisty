import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

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
        const { amount, date, categoryId, description } = body
        const updateData: any = {}

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
