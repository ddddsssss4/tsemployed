/*
  Warnings:

  - You are about to drop the column `attempts` on the `LevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `failCount` on the `LevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `passCount` on the `LevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `accuracy` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `attempts` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `completeness` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `failCount` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `fluency` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `passCount` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `pronunciation` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `SubLevelProgress` table. All the data in the column will be lost.
  - You are about to drop the `DefaultLevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DefaultSubLevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DefaultLevelToSubLevel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `scoreCustom` to the `SubLevelProgress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DefaultSubLevel" DROP CONSTRAINT "DefaultSubLevel_levelId_fkey";

-- DropForeignKey
ALTER TABLE "_DefaultLevelToSubLevel" DROP CONSTRAINT "_DefaultLevelToSubLevel_A_fkey";

-- DropForeignKey
ALTER TABLE "_DefaultLevelToSubLevel" DROP CONSTRAINT "_DefaultLevelToSubLevel_B_fkey";

-- AlterTable
ALTER TABLE "LevelProgress" DROP COLUMN "attempts",
DROP COLUMN "failCount",
DROP COLUMN "passCount";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "imageUrl",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "StudentDetail" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "type" "StudentType";

-- AlterTable
ALTER TABLE "SubLevelProgress" DROP COLUMN "accuracy",
DROP COLUMN "attempts",
DROP COLUMN "completeness",
DROP COLUMN "failCount",
DROP COLUMN "fluency",
DROP COLUMN "passCount",
DROP COLUMN "pronunciation",
DROP COLUMN "score",
ADD COLUMN     "accuracyAzure" DOUBLE PRECISION,
ADD COLUMN     "accuracyCustom" DOUBLE PRECISION,
ADD COLUMN     "attemptsAzure" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "attemptsCustom" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completenessAzure" DOUBLE PRECISION,
ADD COLUMN     "completenessCustom" DOUBLE PRECISION,
ADD COLUMN     "failCountAzure" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "failCountCustom" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fluencyAzure" DOUBLE PRECISION,
ADD COLUMN     "fluencyCustom" DOUBLE PRECISION,
ADD COLUMN     "passCountAzure" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "passCountCustom" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pronunciationAzure" DOUBLE PRECISION,
ADD COLUMN     "pronunciationCustom" DOUBLE PRECISION,
ADD COLUMN     "scoreAzure" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "scoreCustom" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "DefaultLevel";

-- DropTable
DROP TABLE "DefaultSubLevel";

-- DropTable
DROP TABLE "_DefaultLevelToSubLevel";
