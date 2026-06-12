interface PasswordInputProps {
    id: string
    label: string
    placeholder: string
    value: string
    onChange: (value: string) => void
    showPassword?: boolean
    onToggleShowPassword?: () => void
    isConfirm?: boolean
}

export default function PasswordInput({
    id,
    label,
    placeholder,
    value,
    onChange,
    showPassword = false,
    onToggleShowPassword,
    isConfirm = false,
}: PasswordInputProps) {
    return (
        <div className="relative w-full">
            <label htmlFor={id} className="sr-only">{label}</label>
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                {isConfirm ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                )}
            </span>
            <input
                id={id}
                type={showPassword ? "text" : "password"}
                required
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-[#252f48] border border-transparent rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all text-sm"
                placeholder={placeholder}
            />
            <button
                type="button"
                onClick={onToggleShowPassword}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
                {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                )}
            </button>
        </div>
    )
}
