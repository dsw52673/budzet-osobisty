import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

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

        const category = await prisma.category.findUnique({
            where: { id }
        })

        if (!category) {
            return NextResponse.json(
                { error: "Kategoria nie istnieje" },
                { status: 404 }
            )
        }

        if (category.isSystem) {
            return NextResponse.json(
                { error: "Nie można usunąć kategorii systemowej" },
                { status: 400 }
            )
        }

        if (category.userId !== userId) {
            return NextResponse.json(
                { error: "Brak uprawnień do usunięcia tej kategorii" },
                { status: 403 }
            )
        }

        const expensesCount = await prisma.expense.count({
            where: { categoryId: id }
        })

        if (expensesCount > 0) {
            return NextResponse.json(
                { error: "Nie można usunąć kategorii, ponieważ zawiera przypisane wydatki" },
                { status: 400 }
            )
        }

        await prisma.category.delete({
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
