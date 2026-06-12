"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Sidebar from "../components/dashboard/Sidebar"
import Header from "../components/dashboard/Header"
import { DashboardProvider, useDashboard } from "../context/DashboardContext"

function ProfileContent() {
    const { checkingToken, userEmail } = useDashboard()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [currency, setCurrency] = useState("PLN")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [loadingData, setLoadingData] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if (!userEmail) return

        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/user/profile")
                if (res.ok) {
                    const data = await res.json()
                    setFirstName(data.firstName || "")
                    setLastName(data.lastName || "")
                    setCurrency(data.currency || "PLN")
                } else {
                    setErrorMessage("Nie udało się pobrać danych profilu")
                }
            } catch {
                setErrorMessage("Błąd podczas łączenia z serwerem")
            } finally {
                setLoadingData(false)
            }
        }

        fetchProfile()
    }, [userEmail])

    if (checkingToken || (userEmail && loadingData)) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#0a1120] p-4">
                <div className="animate-spin h-10 w-10 text-[#b5c7e3]" />
            </main>
        )
    }

    if (!userEmail) {
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage("")
        setSuccessMessage("")

        if (currency.trim().length !== 3) {
            setErrorMessage("Domyślna waluta musi składać się z dokładnie 3 znaków")
            return
        }

        if (newPassword) {
            if (!currentPassword) {
                setErrorMessage("Aktualne hasło jest wymagane do ustawienia nowego hasła")
                return
            }
            if (newPassword.length < 8) {
                setErrorMessage("Nowe hasło musi mieć co najmniej 8 znaków")
                return
            }
            if (newPassword !== confirmPassword) {
                setErrorMessage("Nowe hasła nie są identyczne")
                return
            }
        }

        setIsSaving(true)

        try {
            const body: any = {
                firstName: firstName.trim() || null,
                lastName: lastName.trim() || null,
                currency: currency.trim().toUpperCase()
            }

            if (newPassword) {
                body.currentPassword = currentPassword
                body.newPassword = newPassword
            }

            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })

            const data = await res.json()

            if (res.ok) {
                setSuccessMessage("Profil został zaktualizowany pomyślnie")
                setFirstName(data.firstName || "")
                setLastName(data.lastName || "")
                setCurrency(data.currency || "PLN")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            } else {
                setErrorMessage(data.error || "Wystąpił błąd podczas zapisywania profilu")
            }
        } catch {
            setErrorMessage("Błąd połączenia z serwerem")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <main className="min-h-screen flex bg-[#0a1120] text-slate-100 font-sans">
            <Sidebar />

            <section className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <Header />

                <div className="p-6 md:p-10 max-w-4xl mx-auto w-full space-y-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Powrót do panelu
                        </Link>
                    </div>

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">Mój Profil</h2>
                        <p className="text-slate-400 text-sm mt-1">Zarządzaj swoimi danymi osobowymi oraz bezpieczeństwem konta.</p>
                    </div>

                    {successMessage && (
                        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-sm">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-sm">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-[#131b2e] border border-slate-800/40 rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl">
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-white border-b border-slate-800/60 pb-3">Dane podstawowe</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Adres Email (Login)</label>
                                    <input
                                        type="email"
                                        value={userEmail}
                                        disabled
                                        className="w-full px-4 py-3.5 bg-[#1b253b]/40 border border-slate-800/40 rounded-2xl text-slate-400 cursor-not-allowed text-sm focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Domyślna Waluta</label>
                                    <input
                                        type="text"
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                                        maxLength={3}
                                        required
                                        className="w-full px-4 py-3.5 bg-[#1b253b] border border-slate-800/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all text-sm"
                                        placeholder="np. PLN"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Imię</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-[#1b253b] border border-slate-800/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all text-sm"
                                        placeholder="Wpisz swoje imię"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nazwisko</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-[#1b253b] border border-slate-800/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all text-sm"
                                        placeholder="Wpisz swoje nazwisko"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-white border-b border-slate-800/60 pb-3">Zmień hasło</h3>
                            <p className="text-xs text-slate-400">Wypełnij te pola tylko jeśli chcesz zmienić aktualne hasło do logowania.</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Aktualne hasło</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-[#1b253b] border border-slate-800/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nowe hasło</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-[#1b253b] border border-slate-800/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all text-sm"
                                        placeholder="Min. 8 znaków"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Potwierdź nowe hasło</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-[#1b253b] border border-slate-800/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-8 py-3.5 bg-[#b5c7e3] hover:bg-[#a7b9d5] text-[#0a1120] font-bold rounded-xl shadow-lg shadow-[#b5c7e3]/10 cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin h-5 w-5 border-2 border-[#0a1120] border-t-transparent rounded-full" />
                                        <span>Zapisywanie...</span>
                                    </>
                                ) : (
                                    <span>Zapisz zmiany</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}

export default function ProfilePage() {
    return (
        <DashboardProvider>
            <ProfileContent />
        </DashboardProvider>
    )
}
