-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "amountInBase" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'PLN',
ADD COLUMN     "exchangeRate" DECIMAL(12,6) NOT NULL DEFAULT 1.0;
UPDATE "Expense" SET "amountInBase" = "amount";