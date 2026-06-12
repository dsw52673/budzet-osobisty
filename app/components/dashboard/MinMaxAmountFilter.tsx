interface MinMaxAmountFilterProps {
    minAmount: string
    setMinAmount: (val: string) => void
    maxAmount: string
    setMaxAmount: (val: string) => void
}

export default function MinMaxAmountFilter({
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount
}: MinMaxAmountFilterProps) {
    const incrementMin = () => {
        const val = Number(minAmount) || 0
        setMinAmount((val + 10).toString())
    }

    const decrementMin = () => {
        const val = Number(minAmount) || 0
        if (val >= 10) {
            setMinAmount((val - 10).toString())
        } else {
            setMinAmount("0")
        }
    }

    const incrementMax = () => {
        const val = Number(maxAmount) || 0
        setMaxAmount((val + 10).toString())
    }

    const decrementMax = () => {
        const val = Number(maxAmount) || 0
        if (val >= 10) {
            setMaxAmount((val - 10).toString())
        } else {
            setMaxAmount("0")
        }
    }

    return (
        <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kwota (Min - Max)</label>
            <div className="flex items-center gap-2">
                <div className="relative w-full">
                    <input
                        type="number"
                        placeholder="0"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="absolute inset-y-0 right-0 flex flex-col w-8 border-l border-slate-700/45">
                        <button
                            type="button"
                            onClick={incrementMin}
                            className="flex-1 flex items-center justify-center hover:bg-slate-700/40 text-slate-400 hover:text-white rounded-tr-2xl transition-colors cursor-pointer border-b border-slate-700/45"
                        >
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={decrementMin}
                            className="flex-1 flex items-center justify-center hover:bg-slate-700/40 text-slate-400 hover:text-white rounded-br-2xl transition-colors cursor-pointer"
                        >
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
                <span className="text-slate-505">—</span>
                <div className="relative w-full">
                    <input
                        type="number"
                        placeholder="10k+"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="absolute inset-y-0 right-0 flex flex-col w-8 border-l border-slate-700/45">
                        <button
                            type="button"
                            onClick={incrementMax}
                            className="flex-1 flex items-center justify-center hover:bg-slate-700/40 text-slate-400 hover:text-white rounded-tr-2xl transition-colors cursor-pointer border-b border-slate-700/45"
                        >
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={decrementMax}
                            className="flex-1 flex items-center justify-center hover:bg-slate-700/40 text-slate-400 hover:text-white rounded-br-2xl transition-colors cursor-pointer"
                        >
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
