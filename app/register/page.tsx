"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import RegisterHeader from "../components/auth/RegisterHeader"
import ErrorAlert from "../components/auth/ErrorAlert"
import EmailInput from "../components/auth/EmailInput"
import PasswordInput from "../components/auth/PasswordInput"
import SubmitButton from "../components/auth/SubmitButton"

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")

        if (password.length < 8) {
            setError("Hasło musi mieć co najmniej 8 znaków")
            return
        }

        if (password !== confirmPassword) {
            setError("Hasła nie są identyczne")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Wystąpił błąd podczas rejestracji")
                setLoading(false)
                return
            }

            document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict; Secure`
            window.location.href = "/"
        } catch {
            setError("Błąd połączenia z serwerem")
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#0a1120] p-4">
            <div className="w-full max-w-[22rem] sm:max-w-md bg-[#1b253b] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl flex flex-col items-center border border-slate-800/40">
                <RegisterHeader />

                <ErrorAlert error={error} />

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <EmailInput value={email} onChange={setEmail} />

                    <PasswordInput
                        id="password-input"
                        label="Hasło"
                        placeholder="Hasło"
                        value={password}
                        onChange={setPassword}
                        showPassword={showPassword}
                        onToggleShowPassword={() => setShowPassword(!showPassword)}
                    />

                    <PasswordInput
                        id="confirm-password-input"
                        label="Potwierdź hasło"
                        placeholder="Potwierdź hasło"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        showPassword={showConfirmPassword}
                        onToggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                        isConfirm
                    />

                    <SubmitButton loading={loading} text="Zarejestruj się" />
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    Masz już konto?{" "}
                    <Link href="/" className="text-slate-200 hover:text-white font-semibold transition-colors cursor-pointer">
                        Zaloguj się
                    </Link>
                </div>
            </div>
        </main>
    )
}
