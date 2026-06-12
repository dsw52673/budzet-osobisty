-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'PLN',
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;
