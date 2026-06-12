"use client"

import { useDashboard } from "../../context/DashboardContext"

export default function ExpenseModal() {
    const {
        isExpenseModalOpen,
        setIsExpenseModalOpen,
        error,
        loading,
        expenseAmount,
        setExpenseAmount,
        expenseCategoryId,
        setExpenseCategoryId,
        expenseDescription,
        setExpenseDescription,
        expenseDate,
        setExpenseDate,
        expenseCurrency,
        setExpenseCurrency,
        categories,
        isCatDropdownOpen,
        setIsCatDropdownOpen,
        handleAddExpense,
        handleEditExpense,
        editingExpenseId,
        setEditingExpenseId,
        incrementAmount,
        decrementAmount
    } = useDashboard()

    if (!isExpenseModalOpen) {
        return null
    }

    const selectedCategory = categories.find((c) => c.id === expenseCategoryId)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1120]/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#1b253b] border border-slate-800/40 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">
                        {editingExpenseId ? "Edytuj wydatek" : "Dodaj nowy wydatek"}
                    </h3>
                    <button
                        onClick={() => {
                            setIsExpenseModalOpen(false)
                            setIsCatDropdownOpen(false)
                            setEditingExpenseId(null)
                        }}
                        className="text-slate-400 hover:text-white cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm px-4 py-3 rounded-2xl mb-6">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={editingExpenseId ? handleEditExpense : handleAddExpense} className="space-y-4">
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label htmlFor="expense-amount-input" className="block text-xs font-bold text-slate-405 uppercase tracking-wider mb-2">Kwota</label>
                            <div className="relative">
                                <input
                                    id="expense-amount-input"
                                    type="number"
                                    required
                                    min="0.01"
                                    step="any"
                                    value={expenseAmount}
                                    onChange={(e) => setExpenseAmount(e.target.value)}
                                    className="w-full pl-4 pr-12 py-3.5 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="np. 24.50"
                                />
                                <div className="absolute inset-y-0 right-0 flex flex-col w-10 border-l border-slate-700/45">
                                    <button
                                        type="button"
                                        onClick={incrementAmount}
                                        className="flex-1 flex items-center justify-center hover:bg-slate-700/40 text-slate-400 hover:text-white rounded-tr-2xl transition-colors cursor-pointer border-b border-slate-700/45"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={decrementAmount}
                                        className="flex-1 flex items-center justify-center hover:bg-slate-700/40 text-slate-400 hover:text-white rounded-br-2xl transition-colors cursor-pointer"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-28">
                            <label htmlFor="expense-currency-select" className="block text-xs font-bold text-slate-405 uppercase tracking-wider mb-2">Waluta</label>
                            <select
                                id="expense-currency-select"
                                value={expenseCurrency}
                                onChange={(e) => setExpenseCurrency(e.target.value)}
                                className="w-full px-4 py-3.5 bg-[#252f48] border border-transparent rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm cursor-pointer"
                            >
                                <option value="PLN">PLN</option>
                                <option value="EUR">EUR</option>
                                <option value="USD">USD</option>
                                <option value="GBP">GBP</option>
                                <option value="CHF">CHF</option>
                                <option value="NOK">NOK</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-405 uppercase tracking-wider mb-2">Kategoria</label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                                className="w-full px-4 py-3.5 bg-[#252f48] border border-transparent rounded-2xl text-left text-white focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm cursor-pointer flex justify-between items-center"
                            >
                                <span>{selectedCategory ? selectedCategory.name : "Wybierz kategorię"}</span>
                                <svg className={`w-4 h-4 text-slate-400 transition-transform ${isCatDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            {isCatDropdownOpen && (
                                <div className="absolute z-10 w-full mt-2 bg-[#252f48] border border-slate-700/80 rounded-2xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar p-1 divide-y divide-slate-700/30">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                setExpenseCategoryId(cat.id)
                                                setIsCatDropdownOpen(false)
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50 hover:text-white rounded-xl transition-colors cursor-pointer"
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="expense-desc-input" className="block text-xs font-bold text-slate-405 uppercase tracking-wider mb-2">Opis (opcjonalny)</label>
                        <input
                            id="expense-desc-input"
                            type="text"
                            value={expenseDescription}
                            onChange={(e) => setExpenseDescription(e.target.value)}
                            className="w-full px-4 py-3.5 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                            placeholder="np. Zakupy w Biedronce"
                        />
                    </div>

                    <div>
                        <label htmlFor="expense-date-input" className="block text-xs font-bold text-slate-405 uppercase tracking-wider mb-2">Data</label>
                        <input
                            id="expense-date-input"
                            type="date"
                            required
                            value={expenseDate}
                            onChange={(e) => setExpenseDate(e.target.value)}
                            className="w-full px-4 py-3.5 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm cursor-pointer"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 py-3.5 bg-[#b5c7e3] hover:bg-[#a7b9d5] active:bg-[#99acca] text-[#0a1120] font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#b5c7e3]/10"
                    >
                        {loading ? (
                            <div className="animate-spin h-5 w-5 border-2 border-[#0a1120] border-t-transparent rounded-full" />
                        ) : (editingExpenseId ? "Zapisz zmiany" : "Dodaj wydatek")}
                    </button>
                </form>
            </div>
        </div>
    )
}
