export default function LoginHeader() {
    return (
        <div className="flex flex-col items-center mb-8 w-full">
            <div className="w-16 h-16 bg-[#0a1120]/60 rounded-full flex items-center justify-center mb-5 shadow-inner">
                <svg className="w-7 h-7 text-slate-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V11M12 21V11M5 21V11M3 11h18M3 21h18M12 3L3 7h18l-9-4z" />
                </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide text-center">Zaloguj się</h1>
        </div>
    )
}
