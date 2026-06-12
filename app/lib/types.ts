export interface Category {
  id: string
  name: string
  isSystem: boolean
}

export interface Expense {
  id: string
  amount: string | number
  currency: string
  amountInBase: string | number
  exchangeRate: string | number
  date: string
  description: string | null
  categoryId: string
  category: Category
}

export interface Budget {
  id: string
  month: number
  year: number
  limitAmount: string | number
  categoryId: string | null
}
