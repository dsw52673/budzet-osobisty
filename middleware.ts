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

    if (!token) {
        if (!isAuthPage && pathname !== "/") {
            return NextResponse.redirect(new URL("/login", req.url))
        }
        return NextResponse.next()
    }

    try {
        await verifyToken(token)
        if (isAuthPage) {
            return NextResponse.redirect(new URL("/", req.url))
        }
        return NextResponse.next()
    } catch {
        if (!isAuthPage && pathname !== "/") {
            return NextResponse.redirect(new URL("/login", req.url))
        }
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
}
