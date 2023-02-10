-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userType_id" TEXT NOT NULL,
    "address_id" TEXT,
    "cnpj_cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "users_userType_id_fkey" FOREIGN KEY ("userType_id") REFERENCES "UserTypes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "users_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Addresses" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("address_id", "cnpj_cpf", "created_at", "email", "id", "name", "password_hash", "phone", "userType_id") SELECT "address_id", "cnpj_cpf", "created_at", "email", "id", "name", "password_hash", "phone", "userType_id" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_userType_id_address_id_email_key" ON "users"("userType_id", "address_id", "email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
