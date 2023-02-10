/*
  Warnings:

  - Made the column `street_number` on table `Addresses` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Addresses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cep" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "street_number" TEXT NOT NULL
);
INSERT INTO "new_Addresses" ("cep", "city", "district", "id", "state", "street", "street_number") SELECT "cep", "city", "district", "id", "state", "street", "street_number" FROM "Addresses";
DROP TABLE "Addresses";
ALTER TABLE "new_Addresses" RENAME TO "Addresses";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
