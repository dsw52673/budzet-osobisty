interface ErrorAlertProps {
    error: string
}

export default function ErrorAlert({ error }: ErrorAlertProps) {
    if (!error) return null

    return (
        <div className="w-full bg-red-500/10 border border-red-500/20 text-red-200 text-sm px-4 py-3 rounded-2xl mb-6 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
        </div>
    )
}
