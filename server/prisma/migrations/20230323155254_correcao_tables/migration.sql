/*
  Warnings:

  - You are about to drop the `materialUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "materialUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "materialsUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL
);
