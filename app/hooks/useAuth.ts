import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
    const router = useRouter()
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [checkingToken, setCheckingToken] = useState(true)

    useEffect(() => {
        const checkToken = () => {
            const getCookie = (name: string) => {
                const value = `; ${document.cookie}`
                const parts = value.split(`; ${name}=`)
                if (parts.length === 2) return parts.pop()?.split(";").shift()
                return null
            }

            const token = getCookie("token")
            if (token) {
                try {
                    const payloadBase64 = token.split(".")[1]
                    if (payloadBase64) {
                        const decoded = JSON.parse(atob(payloadBase64))
                        setUserEmail(decoded.email || "Użytkownik")
                    }
                } catch {}
            }
            setCheckingToken(false)
        }

        setTimeout(checkToken, 0)
    }, [])
    useEffect(() => {
        if (!checkingToken && !userEmail) {
            router.push("/login")
        }
    }, [checkingToken, userEmail, router])

    const handleLogout = () => {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"
        setUserEmail(null)
        router.refresh()
    }

    return {
        userEmail,
        checkingToken,
        handleLogout,
    }
}
