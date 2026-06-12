"use client"

import { useState } from "react"
import Sidebar from "../components/dashboard/Sidebar"
import Header from "../components/dashboard/Header"
import { DashboardProvider, useDashboard } from "../context/DashboardContext"

function CategoriesContent() {
    const { checkingToken, userEmail, categories, expenses, fetchData } = useDashboard()

    const [newCategoryName, setNewCategoryName] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

    if (checkingToken) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#0a1120] p-4">
                <div className="animate-spin h-10 w-10 text-[#b5c7e3]" />
            </main>
        )
    }

    if (!userEmail) {
        return null
    }

    const handleAddCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage("")
        setSuccessMessage("")

        const trimmedName = newCategoryName.trim()
        if (!trimmedName) {
            setErrorMessage("Nazwa kategorii nie może być pusta")
            return
        }

        setIsSaving(true)
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: trimmedName })
            })

            const data = await res.json()

            if (res.ok) {
                setSuccessMessage(`Kategoria "${trimmedName}" została dodana pomyślnie`)
                setNewCategoryName("")
                await fetchData()
            } else {
                setErrorMessage(data.error || "Wystąpił błąd podczas dodawania kategorii")
            }
        } catch {
            setErrorMessage("Błąd połączenia z serwerem")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteCategoryClick = async (id: string) => {
        setErrorMessage("")
        setSuccessMessage("")
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "DELETE"
            })

            const data = await res.json()

            if (res.ok) {
                setSuccessMessage("Kategoria została usunięta pomyślnie")
                setConfirmDeleteId(null)
                await fetchData()
            } else {
                setErrorMessage(data.error || "Wystąpił błąd podczas usuwania kategorii")
            }
        } catch {
            setErrorMessage("Błąd połączenia z serwerem")
        }
    }

    return (
        <main className="min-h-screen flex bg-[#0a1120] text-slate-100 font-sans overflow-hidden">
            <Sidebar />

            <section className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Header />

                <div className="flex-1 flex flex-col p-6 md:p-10 max-w-[80%] mx-auto w-full min-h-0">
                    <div className="mb-6 flex-shrink-0">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">Zarządzanie Kategoriami</h2>
                        <p className="text-slate-400 text-sm mt-1">Zarządzaj swoimi kategoriami wydatków, analizuj powiązane transakcje i ich sumy.</p>
                    </div>

                    {successMessage && (
                        <div className="flex-shrink-0 flex items-center gap-3 p-4 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-sm">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="flex-shrink-0 flex items-center gap-3 p-4 mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-sm">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Table card */}
                    <div className="flex-1 min-h-0 bg-[#131b2e] border border-slate-800/40 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/60 pb-6 flex-shrink-0">
                            <div>
                                <h3 className="text-lg font-bold text-white">Lista Kategorii</h3>
                                <p className="text-xs text-slate-400 mt-1">Podgląd zdefiniowanych kategorii oraz ich podsumowanie finansowe</p>
                            </div>

                            <form onSubmit={handleAddCategorySubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <input
                                        id="new-category-name"
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-[#1b253b] border border-slate-800/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all text-sm"
                                        placeholder="Nowa kategoria..."
                                        required
                                        maxLength={40}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-5 py-2.5 bg-[#b5c7e3] hover:bg-[#a7b9d5] text-[#0a1120] font-bold rounded-xl shadow-lg shadow-[#b5c7e3]/10 cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex-shrink-0"
                                >
                                    {isSaving ? (
                                        <div className="animate-spin h-4 w-4 border-2 border-[#0a1120] border-t-transparent rounded-full" />
                                    ) : (
                                        <span>Dodaj kategorię</span>
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0 mt-6 custom-scrollbar pr-4">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-[#131b2e] z-10">
                                    <tr className="border-b border-slate-800/60 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                                        <th className="pb-3 font-bold bg-[#131b2e]">Nazwa</th>
                                        <th className="pb-3 font-bold bg-[#131b2e]">Typ</th>
                                        <th className="pb-3 text-center font-bold bg-[#131b2e]">Liczba transakcji</th>
                                        <th className="pb-3 text-right font-bold bg-[#131b2e]">Łączna kwota</th>
                                        <th className="pb-3 text-right font-bold bg-[#131b2e]">Akcje</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/40 text-sm">
                                    {categories.map((cat) => {
                                        const catExpenses = expenses.filter(e => e.categoryId === cat.id)
                                        const count = catExpenses.length
                                        const total = catExpenses.reduce((sum, e) => sum + Number(e.amountInBase), 0)

                                        return (
                                            <tr
                                                key={cat.id}
                                                className="hover:bg-[#252f48]/30 transition-colors text-slate-300"
                                            >
                                                <td className="py-4 font-medium pl-2">
                                                    <span>{cat.name}</span>
                                                </td>
                                                <td className="py-4">
                                                    {cat.isSystem ? (
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800/40 px-2 py-0.5 rounded">
                                                            System
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] font-bold text-[#b5c7e3] uppercase tracking-wider bg-[#b5c7e3]/10 px-2 py-0.5 rounded">
                                                            Własna
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-center">{count}</td>
                                                <td className="py-4 text-right font-bold text-slate-200">
                                                    {total.toFixed(2)} PLN
                                                </td>
                                                <td className="py-4 text-right">
                                                    {!cat.isSystem && (
                                                        confirmDeleteId === cat.id ? (
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <button
                                                                    onClick={() => handleDeleteCategoryClick(cat.id)}
                                                                    className="w-7 h-7 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer transition-colors shadow"
                                                                    title="Potwierdź"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => setConfirmDeleteId(null)}
                                                                    className="w-7 h-7 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer transition-colors shadow"
                                                                    title="Anuluj"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-end">
                                                                <button
                                                                    onClick={() => {
                                                                        setConfirmDeleteId(cat.id)
                                                                        setErrorMessage("")
                                                                        setSuccessMessage("")
                                                                    }}
                                                                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 cursor-pointer transition-colors"
                                                                    title="Usuń"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default function CategoriesPage() {
    return (
        <DashboardProvider>
            <CategoriesContent />
        </DashboardProvider>
    )
}
