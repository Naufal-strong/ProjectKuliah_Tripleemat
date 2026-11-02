-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('critical', 'high', 'medium', 'low', 'info');

-- CreateTable
CREATE TABLE "Target" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "auditScope" TEXT NOT NULL,
    "asvsLevel" TEXT NOT NULL,
    "intervalJam" INTEGER,
    "auditorEmail" TEXT,
    "notifyOnComplete" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Temuan" (
    "id" SERIAL NOT NULL,
    "findingId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "description" TEXT NOT NULL,
    "remediation" TEXT NOT NULL,
    "cwe" TEXT,
    "asvsRef" TEXT,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetId" TEXT NOT NULL,

    CONSTRAINT "Temuan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Target_targetUrl_key" ON "Target"("targetUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Temuan_targetId_findingId_key" ON "Temuan"("targetId", "findingId");

-- AddForeignKey
ALTER TABLE "Temuan" ADD CONSTRAINT "Temuan_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
