interface EmailInputProps {
    value: string
    onChange: (value: string) => void
}

export default function EmailInput({ value, onChange }: EmailInputProps) {
    return (
        <div className="relative w-full">
            <label htmlFor="email-input" className="sr-only">Adres email</label>
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </span>
            <input
                id="email-input"
                type="email"
                required
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all text-sm"
                placeholder="Adres email"
            />
        </div>
    )
}
