/*
  Warnings:

  - You are about to drop the column `active` on the `solicitationMaterial` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "solicitationUser" ADD COLUMN "active" BOOLEAN;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_solicitationMaterial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "solicitation_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    CONSTRAINT "solicitationMaterial_solicitation_id_fkey" FOREIGN KEY ("solicitation_id") REFERENCES "solicitationUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "solicitationMaterial_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_solicitationMaterial" ("id", "material_id", "solicitation_id") SELECT "id", "material_id", "solicitation_id" FROM "solicitationMaterial";
DROP TABLE "solicitationMaterial";
ALTER TABLE "new_solicitationMaterial" RENAME TO "solicitationMaterial";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
