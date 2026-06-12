import { useDashboard } from "../../context/DashboardContext"
import { Expense } from "../../lib/types"

interface TransactionRowProps {
    item: Expense
}

export default function TransactionRow({ item }: TransactionRowProps) {
    const {
        deletingId,
        setDeletingId,
        setEditingExpenseId,
        setExpenseAmount,
        setExpenseCategoryId,
        setExpenseDescription,
        setExpenseDate,
        setExpenseCurrency,
        setIsExpenseModalOpen,
        handleDeleteExpense
    } = useDashboard()

    const formatTransactionDate = (dateStr: string) => {
        const d = new Date(dateStr)
        const today = new Date()
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)

        if (d.toDateString() === today.toDateString()) {
            return "Dziś"
        } else if (d.toDateString() === yesterday.toDateString()) {
            return "Wczoraj"
        }

        const months = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"]
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
    }

    const getCategoryIcon = (categoryName: string) => {
        const name = categoryName.toLowerCase()
        if (name.includes("jedzenie") || name.includes("zakupy") || name.includes("spożywcze")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
            )
        }
        if (name.includes("transport") || name.includes("samochód") || name.includes("paliwo")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.318-5.085a8.25 8.25 0 00-1.887-4.73C15.933 6.092 14.398 5.25 12.75 5.25h-1.5m8.49 7.5H2.25m17.49 0H21.75M12 5.25V12" />
                </svg>
            )
        }
        if (name.includes("mieszkanie") || name.includes("rachunki") || name.includes("dom")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            )
        }
        if (name.includes("rozrywka") || name.includes("czas") || name.includes("hobby") || name.includes("kino")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
            )
        }
        if (name.includes("zdrowie") || name.includes("lekarz") || name.includes("leki")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            )
        }
        if (name.includes("edukacja") || name.includes("szkoła") || name.includes("studia") || name.includes("książki")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
            )
        }
        if (name.includes("odzież") || name.includes("ubrania") || name.includes("buty")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-1.245c0-.73-.613-1.282-1.34-1.282h-.88zM14.47 16.122a3 3 0 015.78 1.128 2.25 2.25 0 002.4 2.245 4.5 4.5 0 01-8.4-1.245c0-.73.613-1.282 1.34-1.282h.88zM12 3.75a.75.75 0 01.75.75v14.75a.75.75 0 01-1.5 0V4.5A.75.75 0 0112 3.75z" />
                </svg>
            )
        }
        return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.8 1.8 0 002.546 0l4.319-4.317a1.8 1.8 0 000-2.546L10.58 3.659A2.25 2.25 0 009.568 3zM6 6h.008v.008H6V6z" />
            </svg>
        )
    }

    const handleEditClick = () => {
        setEditingExpenseId(item.id)
        setExpenseAmount(Number(item.amount).toString())
        setExpenseDescription(item.description || "")
        setExpenseDate(new Date(item.date).toISOString().split("T")[0])
        setExpenseCategoryId(item.categoryId)
        setExpenseCurrency(item.currency || "PLN")
        setIsExpenseModalOpen(true)
    }

    return (
        <tr className="hover:bg-[#252f48]/20 transition-colors">
            <td className="py-4 font-semibold flex items-center gap-3">
                <div className="hidden sm:flex w-9 h-9 rounded-full bg-[#252f48] items-center justify-center text-slate-200 flex-shrink-0">
                    {getCategoryIcon(item.category?.name || "Inne")}
                </div>
                <span>{item.category?.name || "Inne"}</span>
            </td>
            <td className="py-4 text-slate-400 font-medium max-w-[200px] truncate hidden sm:table-cell">
                {item.description || "—"}
            </td>
            <td className="py-4 text-slate-400 font-semibold hidden sm:table-cell">
                {formatTransactionDate(item.date)}
            </td>
            <td className="py-4 text-right">
                <div className="text-xs sm:text-sm font-bold sm:font-black text-red-400">
                    -{Number(item.amount).toFixed(2)} {item.currency || "PLN"}
                </div>
                {item.currency && item.currency !== "PLN" && (
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        ~{Number(item.amountInBase).toFixed(2)} PLN
                    </div>
                )}
            </td>
            <td className="py-4 text-right">
                {deletingId === item.id ? (
                    <div className="flex items-center justify-end gap-1.5">
                        <button
                            onClick={() => handleDeleteExpense(item.id)}
                            className="w-9 h-9 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-xl cursor-pointer transition-colors shadow-md shadow-green-600/10"
                            title="Potwierdź"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setDeletingId(null)}
                            className="w-9 h-9 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer transition-colors shadow-md shadow-red-600/10"
                            title="Anuluj"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-end gap-1.5">
                        <button
                            onClick={handleEditClick}
                            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors rounded-xl hover:bg-[#252f48]"
                            title="Edytuj"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setDeletingId(item.id)}
                            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-red-400 cursor-pointer transition-colors rounded-xl hover:bg-red-500/10"
                            title="Usuń"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )}
            </td>
        </tr>
    )
}
