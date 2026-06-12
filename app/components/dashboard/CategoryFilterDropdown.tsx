import { useState } from "react"
import { useDashboard } from "../../context/DashboardContext"

interface CategoryFilterDropdownProps {
    selectedCategoryId: string
    setSelectedCategoryId: (val: string) => void
}

export default function CategoryFilterDropdown({
    selectedCategoryId,
    setSelectedCategoryId
}: CategoryFilterDropdownProps) {
    const { categories } = useDashboard()
    const [isFilterCatDropdownOpen, setIsFilterCatDropdownOpen] = useState(false)

    const selectedCategoryName = categories.find((c) => c.id === selectedCategoryId)?.name || "Wszystkie kategorie"

    return (
        <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kategoria</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsFilterCatDropdownOpen(!isFilterCatDropdownOpen)}
                    className="w-full px-4 py-3.5 bg-[#252f48] border border-transparent rounded-2xl text-left text-white focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm cursor-pointer flex justify-between items-center"
                >
                    <span>{selectedCategoryName}</span>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${isFilterCatDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                {isFilterCatDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-[#252f48] border border-slate-700/80 rounded-2xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar p-1 divide-y divide-slate-700/30">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedCategoryId("")
                                setIsFilterCatDropdownOpen(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50 hover:text-white rounded-xl transition-colors cursor-pointer"
                        >
                            Wszystkie kategorie
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                    setSelectedCategoryId(cat.id)
                                    setIsFilterCatDropdownOpen(false)
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
    )
}
