-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_solicitationUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client_user_id" TEXT NOT NULL,
    "company_user_id" TEXT NOT NULL,
    "active" BOOLEAN,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "solicitationUser_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "solicitationUser_company_user_id_fkey" FOREIGN KEY ("company_user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_solicitationUser" ("active", "client_user_id", "company_user_id", "id") SELECT "active", "client_user_id", "company_user_id", "id" FROM "solicitationUser";
DROP TABLE "solicitationUser";
ALTER TABLE "new_solicitationUser" RENAME TO "solicitationUser";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
