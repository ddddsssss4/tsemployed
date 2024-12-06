/*
  Warnings:

  - You are about to drop the column `accuracyCustom` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `attemptsCustom` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `completenessCustom` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `failCountCustom` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `fluencyCustom` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `passCountCustom` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `pronunciationCustom` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `scoreCustom` on the `SubLevelProgress` table. All the data in the column will be lost.
  - Added the required column `langaugeModelID` to the `SubLevelProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubLevelProgress" DROP COLUMN "accuracyCustom",
DROP COLUMN "attemptsCustom",
DROP COLUMN "completenessCustom",
DROP COLUMN "failCountCustom",
DROP COLUMN "fluencyCustom",
DROP COLUMN "passCountCustom",
DROP COLUMN "pronunciationCustom",
DROP COLUMN "scoreCustom",
ADD COLUMN  "langaugeModelID" TEXT NOT NULL;

-- Check and drop the column if it exists
DO $$
BEGIN
    IF EXISTS (SELECT column_name 
               FROM information_schema.columns 
               WHERE table_name='SubLevelProgress' AND column_name='langaugeModelID') THEN
        -- Remove existing foreign key constraint if it exists
        ALTER TABLE "SubLevelProgress" 
        DROP CONSTRAINT IF EXISTS "SubLevelProgress_langaugeModelID_fkey";
    END IF;
END $$;

-- Create LanguageModel table if not exists
CREATE TABLE IF NOT EXISTS "LanguageModel" (
    "id" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "modelNo" TEXT NOT NULL DEFAULT 'Azure-001',
    "description" TEXT,
    "version" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LanguageModel_pkey" PRIMARY KEY ("id")
);

-- Create unique index on modelNo if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'LanguageModel_modelNo_key' AND n.nspname = 'public'
    ) THEN
        CREATE UNIQUE INDEX "LanguageModel_modelNo_key" ON "LanguageModel"("modelNo");
    END IF;
END $$;

-- Insert a default model if it doesn't exist
INSERT INTO "LanguageModel" ("id", "modelNo", "modelName", "description")
SELECT 'default-model-id', 'Azure-001', 'Default Azure Model', 'Initial language model'
WHERE NOT EXISTS (
    SELECT 1 FROM "LanguageModel" WHERE "modelNo" = 'Azure-001'
);

-- Ensure the column exists and is of the correct type
ALTER TABLE "SubLevelProgress" 
ALTER COLUMN "langaugeModelID" TYPE TEXT,
ALTER COLUMN "langaugeModelID" SET NOT NULL,
ALTER COLUMN "langaugeModelID" SET DEFAULT 'Azure-001';

-- Add or update foreign key constraint
ALTER TABLE "SubLevelProgress" 
ADD CONSTRAINT "SubLevelProgress_langaugeModelID_fkey"
FOREIGN KEY ("langaugeModelID") 
REFERENCES "LanguageModel"("modelNo") 
ON DELETE RESTRICT 
ON UPDATE CASCADE;

-- Update existing records to have a default model if needed
UPDATE "SubLevelProgress"
SET "langaugeModelID" = 'Azure-001'
WHERE "langaugeModelID" IS NULL OR "langaugeModelID" = '';