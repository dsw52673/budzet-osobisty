import ActiveChips from "./ActiveChips"
import CategoryFilterDropdown from "./CategoryFilterDropdown"
import MinMaxAmountFilter from "./MinMaxAmountFilter"

interface TransactionFiltersProps {
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
}

export default function TransactionFilters({
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
    setMaxAmount
}: TransactionFiltersProps) {
    const clearFilters = () => {
        setSearchTerm("")
        setStartDate("")
        setEndDate("")
        setSelectedCategoryId("")
        setMinAmount("")
        setMaxAmount("")
    }

    return (
        <div className="bg-[#1b253b] border border-slate-800/40 rounded-[2rem] p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Wyszukaj opis</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Np. Zakupy spożywcze..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Zakres dat</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full min-w-0 px-2 sm:px-4 py-2.5 sm:py-3 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-xs sm:text-sm cursor-pointer"
                        />
                        <span className="text-slate-505">—</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full min-w-0 px-2 sm:px-4 py-2.5 sm:py-3 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-xs sm:text-sm cursor-pointer"
                        />
                    </div>
                </div>

                <CategoryFilterDropdown
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                />

                <MinMaxAmountFilter
                    minAmount={minAmount}
                    setMinAmount={setMinAmount}
                    maxAmount={maxAmount}
                    setMaxAmount={setMaxAmount}
                />
            </div>

            <ActiveChips
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                minAmount={minAmount}
                setMinAmount={setMinAmount}
                maxAmount={maxAmount}
                setMaxAmount={setMaxAmount}
                clearFilters={clearFilters}
            />
        </div>
    )
}
