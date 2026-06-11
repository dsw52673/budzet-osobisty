import { SignJWT, jwtVerify } from "jose"

const getSecret = () => {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error("JWT_SECRET is not defined")
    return new TextEncoder().encode(secret)
}

export type JwtPayload = {
    userId: string
    email: string
}

export async function signToken(payload: JwtPayload): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(getSecret())
}

export async function verifyToken(token: string): Promise<JwtPayload> {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as JwtPayload
}
