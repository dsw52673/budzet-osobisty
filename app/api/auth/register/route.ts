import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { hashPassword } from "../../../lib/hash"
import { signToken } from "../../../lib/jwt"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: "Pola email i hasło są wymagane" },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Hasło musi mieć co najmniej 8 znaków" },
                { status: 400 }
            )
        }

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json(
                { error: "Użytkownik z tym adresem email już istnieje" },
                { status: 409 }
            )
        }

        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        })

        const token = await signToken({ userId: user.id, email: user.email })

        return NextResponse.json(
            {
                token,
                user: { id: user.id, email: user.email },
            },
            { status: 201 }
        )
    } catch {
        return NextResponse.json(
            { error: "Błąd serwera" },
            { status: 500 }
        )
    }
}
