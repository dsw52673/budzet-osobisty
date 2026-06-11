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

        const budget = await prisma.budget.findUnique({
            where: { id },
            include: {
                category: true
            }
        })

        if (!budget) {
            return NextResponse.json(
                { error: "Budżet nie istnieje" },
                { status: 404 }
            )
        }

        if (budget.userId !== userId) {
            return NextResponse.json(
                { error: "Brak uprawnień do wyświetlenia tego budżetu" },
                { status: 403 }
            )
        }

        return NextResponse.json(budget, { status: 200 })
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

        const budget = await prisma.budget.findUnique({
            where: { id }
        })

        if (!budget) {
            return NextResponse.json(
                { error: "Budżet nie istnieje" },
                { status: 404 }
            )
        }

        if (budget.userId !== userId) {
            return NextResponse.json(
                { error: "Brak uprawnień do edycji tego budżetu" },
                { status: 403 }
            )
        }

        const body = await req.json()
        const { limitAmount } = body

        if (limitAmount === undefined || limitAmount === null || typeof limitAmount !== "number" || limitAmount <= 0) {
            return NextResponse.json(
                { error: "Kwota limitu musi być liczbą większą od zera" },
                { status: 400 }
            )
        }

        const updatedBudget = await prisma.budget.update({
            where: { id },
            data: { limitAmount },
            include: {
                category: true
            }
        })

        return NextResponse.json(updatedBudget, { status: 200 })
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

        const budget = await prisma.budget.findUnique({
            where: { id }
        })

        if (!budget) {
            return NextResponse.json(
                { error: "Budżet nie istnieje" },
                { status: 404 }
            )
        }

        if (budget.userId !== userId) {
            return NextResponse.json(
                { error: "Brak uprawnień do usunięcia tego budżetu" },
                { status: 403 }
            )
        }

        await prisma.budget.delete({
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
