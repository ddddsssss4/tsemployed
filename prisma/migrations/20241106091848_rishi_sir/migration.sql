-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_teacherId_fkey";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("uniqueId") ON DELETE SET NULL ON UPDATE CASCADE;
