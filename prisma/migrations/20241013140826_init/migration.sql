-- CreateEnum
CREATE TYPE "StudentType" AS ENUM ('KINDERGARTEN', 'PRIMARY', 'SECONDARY', 'HIGH_SCHOOL');

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "imageUrl" TEXT,
    "uniqueId" TEXT,
    "teacherId" INTEGER,
    "type" "StudentType",

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "imageUrl" TEXT,
    "uniqueId" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" SERIAL NOT NULL,
    "levelNumber" INTEGER NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubLevel" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "content" TEXT,
    "levelId" INTEGER NOT NULL,
    "order" INTEGER,

    CONSTRAINT "SubLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelProgress" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "passCount" INTEGER NOT NULL DEFAULT 0,
    "failCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LevelProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubLevelProgress" (
    "id" SERIAL NOT NULL,
    "levelProgressId" INTEGER NOT NULL,
    "subLevelId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "accuracy" DOUBLE PRECISION,
    "completeness" DOUBLE PRECISION,
    "pronunciation" DOUBLE PRECISION,
    "fluency" DOUBLE PRECISION,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "passCount" INTEGER NOT NULL DEFAULT 0,
    "failCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SubLevelProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultLevel" (
    "id" SERIAL NOT NULL,
    "levelNumber" INTEGER NOT NULL,

    CONSTRAINT "DefaultLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultSubLevel" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "content" TEXT,
    "levelId" INTEGER NOT NULL,
    "order" INTEGER,

    CONSTRAINT "DefaultSubLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDetail" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "age" INTEGER,
    "favoriteColor" TEXT,
    "grade" TEXT,
    "skillLevel" TEXT,
    "ethnicity" TEXT,
    "background" TEXT,

    CONSTRAINT "StudentDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DefaultLevelToSubLevel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_uniqueId_key" ON "Student"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_uniqueId_key" ON "Teacher"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "Level_levelNumber_key" ON "Level"("levelNumber");

-- CreateIndex
CREATE UNIQUE INDEX "LevelProgress_studentId_levelId_key" ON "LevelProgress"("studentId", "levelId");

-- CreateIndex
CREATE UNIQUE INDEX "SubLevelProgress_levelProgressId_subLevelId_key" ON "SubLevelProgress"("levelProgressId", "subLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultLevel_levelNumber_key" ON "DefaultLevel"("levelNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StudentDetail_studentId_key" ON "StudentDetail"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "_DefaultLevelToSubLevel_AB_unique" ON "_DefaultLevelToSubLevel"("A", "B");

-- CreateIndex
CREATE INDEX "_DefaultLevelToSubLevel_B_index" ON "_DefaultLevelToSubLevel"("B");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubLevel" ADD CONSTRAINT "SubLevel_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelProgress" ADD CONSTRAINT "LevelProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelProgress" ADD CONSTRAINT "LevelProgress_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubLevelProgress" ADD CONSTRAINT "SubLevelProgress_levelProgressId_fkey" FOREIGN KEY ("levelProgressId") REFERENCES "LevelProgress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubLevelProgress" ADD CONSTRAINT "SubLevelProgress_subLevelId_fkey" FOREIGN KEY ("subLevelId") REFERENCES "SubLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultSubLevel" ADD CONSTRAINT "DefaultSubLevel_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "DefaultLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDetail" ADD CONSTRAINT "StudentDetail_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefaultLevelToSubLevel" ADD CONSTRAINT "_DefaultLevelToSubLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "DefaultLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefaultLevelToSubLevel" ADD CONSTRAINT "_DefaultLevelToSubLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "SubLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
