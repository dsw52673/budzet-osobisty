import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { hashPassword, comparePasswords } from "../../../lib/hash"

export async function GET(req: NextRequest): Promise<Response> {
    try {
        const userId = req.headers.get("x-user-id")
        if (!userId) {
            return NextResponse.json(
                { error: "Brak autoryzacji" },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return NextResponse.json(
                { error: "Użytkownik nie istnieje" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            currency: user.currency,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    } catch {
        return NextResponse.json(
            { error: "Błąd serwera" },
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest): Promise<Response> {
    try {
        const userId = req.headers.get("x-user-id")
        if (!userId) {
            return NextResponse.json(
                { error: "Brak autoryzacji" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { firstName, lastName, currency, currentPassword, newPassword } = body

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return NextResponse.json(
                { error: "Użytkownik nie istnieje" },
                { status: 404 }
            )
        }

        const updateData: any = {}

        if (firstName !== undefined) {
            updateData.firstName = firstName
        }

        if (lastName !== undefined) {
            updateData.lastName = lastName
        }

        if (currency !== undefined) {
            const trimmedCurrency = currency.trim()
            if (trimmedCurrency.length !== 3) {
                return NextResponse.json(
                    { error: "Kod waluty musi składać się z dokładnie 3 znaków" },
                    { status: 400 }
                )
            }
            updateData.currency = trimmedCurrency.toUpperCase()
        }

        if (newPassword !== undefined) {
            if (!currentPassword) {
                return NextResponse.json(
                    { error: "Aktualne hasło jest wymagane do ustawienia nowego hasła" },
                    { status: 400 }
                )
            }

            if (newPassword.length < 8) {
                return NextResponse.json(
                    { error: "Nowe hasło musi mieć co najmniej 8 znaków" },
                    { status: 400 }
                )
            }

            const isCurrentPasswordCorrect = await comparePasswords(currentPassword, user.password)
            if (!isCurrentPasswordCorrect) {
                return NextResponse.json(
                    { error: "Aktualne hasło jest niepoprawne" },
                    { status: 401 }
                )
            }

            updateData.password = await hashPassword(newPassword)
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        })

        return NextResponse.json({
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            currency: updatedUser.currency,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        })
    } catch {
        return NextResponse.json(
            { error: "Błąd serwera" },
            { status: 500 }
        )
    }
}
