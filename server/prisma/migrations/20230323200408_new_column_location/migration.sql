/*
  Warnings:

  - Added the required column `location` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_addresses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cep" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "street_number" TEXT
);
INSERT INTO "new_addresses" ("cep", "city", "district", "id", "state", "street", "street_number") SELECT "cep", "city", "district", "id", "state", "street", "street_number" FROM "addresses";
DROP TABLE "addresses";
ALTER TABLE "new_addresses" RENAME TO "addresses";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
