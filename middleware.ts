import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./app/lib/jwt"

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    if (pathname.startsWith("/_next") || pathname === "/favicon.ico" || pathname.startsWith("/api/auth")) {
        return NextResponse.next()
    }

    const token = req.cookies.get("token")?.value || ""

    if (pathname.startsWith("/api")) {
        const authHeader = req.headers.get("authorization")
        let apiToken = ""
        if (authHeader && authHeader.startsWith("Bearer ")) {
            apiToken = authHeader.substring(7)
        } else {
            apiToken = token
        }

        if (!apiToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        try {
            const decoded = await verifyToken(apiToken)
            const requestHeaders = new Headers(req.headers)
            requestHeaders.set("x-user-id", decoded.userId)
            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            })
        } catch {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }
    }

    const isAuthPage = pathname === "/login" || pathname === "/register"

    let isValidUser = false
    if (token) {
        try {
            await verifyToken(token)
            isValidUser = true
        } catch {
            isValidUser = false
        }
    }

    if (isValidUser) {
        if (isAuthPage) {
            return NextResponse.redirect(new URL("/", req.url))
        }
        return NextResponse.next()
    } else {
        if (isAuthPage) {
            return NextResponse.next()
        }
        const response = NextResponse.redirect(new URL("/login", req.url))
        if (token) {
            response.cookies.delete("token")
        }
        return response
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
}
