-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "userId" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "Event"("id");
