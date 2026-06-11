import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { comparePasswords } from "../../../lib/hash"
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

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return NextResponse.json(
                { error: "Nieprawidłowy email lub hasło" },
                { status: 401 }
            )
        }

        const passwordValid = await comparePasswords(password, user.password)

        if (!passwordValid) {
            return NextResponse.json(
                { error: "Nieprawidłowy email lub hasło" },
                { status: 401 }
            )
        }

        const token = await signToken({ userId: user.id, email: user.email })

        return NextResponse.json(
            {
                token,
                user: { id: user.id, email: user.email },
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            { error: "Błąd serwera" },
            { status: 500 }
        )
    }
}
