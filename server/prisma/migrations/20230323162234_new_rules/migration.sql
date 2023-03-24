-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_materialsUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    CONSTRAINT "materialsUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "materialsUser_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_materialsUser" ("id", "material_id", "user_id") SELECT "id", "material_id", "user_id" FROM "materialsUser";
DROP TABLE "materialsUser";
ALTER TABLE "new_materialsUser" RENAME TO "materialsUser";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
