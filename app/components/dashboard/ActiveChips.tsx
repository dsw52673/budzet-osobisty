import { useDashboard } from "../../context/DashboardContext"

interface ActiveChipsProps {
    searchTerm: string
    setSearchTerm: (val: string) => void
    startDate: string
    setStartDate: (val: string) => void
    endDate: string
    setEndDate: (val: string) => void
    selectedCategoryId: string
    setSelectedCategoryId: (val: string) => void
    minAmount: string
    setMinAmount: (val: string) => void
    maxAmount: string
    setMaxAmount: (val: string) => void
    clearFilters: () => void
}

export default function ActiveChips({
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedCategoryId,
    setSelectedCategoryId,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    clearFilters
}: ActiveChipsProps) {
    const { categories } = useDashboard()

    const hasActiveFilters = searchTerm || selectedCategoryId || startDate || endDate || minAmount || maxAmount

    if (!hasActiveFilters) {
        return null
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-slate-800/40">
            <div className="flex flex-wrap gap-2">
                {searchTerm && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#252f48] hover:bg-[#2e3a59] text-xs font-bold rounded-xl transition-colors text-slate-200">
                        Opis: {searchTerm}
                        <button onClick={() => setSearchTerm("")} className="cursor-pointer text-slate-400 hover:text-white">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </span>
                )}
                {selectedCategoryId && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#252f48] hover:bg-[#2e3a59] text-xs font-bold rounded-xl transition-colors text-slate-200">
                        Kategoria: {categories.find((c) => c.id === selectedCategoryId)?.name}
                        <button onClick={() => setSelectedCategoryId("")} className="cursor-pointer text-slate-400 hover:text-white">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </span>
                )}
                {(startDate || endDate) && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#252f48] hover:bg-[#2e3a59] text-xs font-bold rounded-xl transition-colors text-slate-200">
                        Data: {startDate || "..."} do {endDate || "..."}
                        <button
                            onClick={() => {
                                setStartDate("")
                                setEndDate("")
                            }}
                            className="cursor-pointer text-slate-400 hover:text-white"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </span>
                )}
                {(minAmount || maxAmount) && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#252f48] hover:bg-[#2e3a59] text-xs font-bold rounded-xl transition-colors text-slate-200">
                        Kwota: {minAmount || "0"} - {maxAmount || "10k+"} PLN
                        <button
                            onClick={() => {
                                setMinAmount("")
                                setMaxAmount("")
                            }}
                            className="cursor-pointer text-slate-400 hover:text-white"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </span>
                )}
            </div>

            <button
                onClick={clearFilters}
                className="text-xs text-sky-blue-light-400 hover:text-sky-blue-light-300 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
                </svg>
                <span>Wyczyść filtry</span>
            </button>
        </div>
    )
}
