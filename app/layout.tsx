import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { DashboardProvider } from "./context/DashboardContext"
import MobileHeader from "./components/dashboard/MobileHeader"
import BudgetModal from "./components/dashboard/BudgetModal"
import ExpenseModal from "./components/dashboard/ExpenseModal"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Budżet osobisty",
  description: "Zarządzanie finansami osobistymi",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a1120]">
        <DashboardProvider>
            <MobileHeader />
            <div className="flex-1 flex flex-col pt-[57px] md:pt-0 min-h-0">
                {children}
            </div>
            <BudgetModal />
            <ExpenseModal />
        </DashboardProvider>
      </body>
    </html>
  )
}
