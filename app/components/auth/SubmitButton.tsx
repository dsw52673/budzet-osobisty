interface SubmitButtonProps {
    loading: boolean
    text: string
}

export default function SubmitButton({ loading, text }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#b5c7e3] hover:bg-[#a7b9d5] active:bg-[#99acca] text-[#0a1120] font-bold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#b5c7e3]/10 hover:shadow-[#b5c7e3]/20"
        >
            {loading ? (
                <svg className="animate-spin h-5 w-5 text-[#0a1120]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : (
                <>
                    <span>{text}</span>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </>
            )}
        </button>
    )
}
