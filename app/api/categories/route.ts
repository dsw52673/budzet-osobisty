import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../lib/prisma"

const defaultSystemCategories = [
    "Jedzenie",
    "Transport",
    "Mieszkanie i rachunki",
    "Rozrywka i wolny czas",
    "Zdrowie",
    "Edukacja",
    "Odzież",
    "Inne"
]

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id")
        if (!userId) {
            return NextResponse.json(
                { error: "Brak autoryzacji" },
                { status: 401 }
            )
        }

        const systemCategoriesCount = await prisma.category.count({
            where: { isSystem: true }
        })

        if (systemCategoriesCount === 0) {
            await prisma.category.createMany({
                data: defaultSystemCategories.map(name => ({
                    name,
                    isSystem: true,
                    userId: null
                }))
            })
        }

        const categories = await prisma.category.findMany({
            where: {
                OR: [
                    { isSystem: true },
                    { userId }
                ]
            }
        })

        return NextResponse.json(categories, { status: 200 })
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
        const { name } = body

        if (!name || typeof name !== "string" || name.trim() === "") {
            return NextResponse.json(
                { error: "Nazwa kategorii jest wymagana" },
                { status: 400 }
            )
        }

        const trimmedName = name.trim()

        const existingCategory = await prisma.category.findFirst({
            where: {
                name: {
                    equals: trimmedName,
                    mode: "insensitive"
                },
                OR: [
                    { isSystem: true },
                    { userId }
                ]
            }
        })

        if (existingCategory) {
            return NextResponse.json(
                { error: "Kategoria o podanej nazwie już istnieje" },
                { status: 400 }
            )
        }

        const newCategory = await prisma.category.create({
            data: {
                name: trimmedName,
                isSystem: false,
                userId
            }
        })

        return NextResponse.json(newCategory, { status: 201 })
    } catch {
        return NextResponse.json(
            { error: "Błąd serwera" },
            { status: 500 }
        )
    }
}
