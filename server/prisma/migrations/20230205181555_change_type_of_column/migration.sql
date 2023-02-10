/*
  Warnings:

  - You are about to drop the column `complement` on the `Addresses` table. All the data in the column will be lost.

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
    "street_number" TEXT
);
INSERT INTO "new_Addresses" ("cep", "city", "district", "id", "state", "street", "street_number") SELECT "cep", "city", "district", "id", "state", "street", "street_number" FROM "Addresses";
DROP TABLE "Addresses";
ALTER TABLE "new_Addresses" RENAME TO "Addresses";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
