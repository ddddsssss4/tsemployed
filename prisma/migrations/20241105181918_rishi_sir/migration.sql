/*
  Warnings:

  - The primary key for the `Teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_teacherId_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "teacherId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Teacher_id_seq";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
