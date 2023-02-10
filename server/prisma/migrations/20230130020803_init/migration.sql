-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userType_id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,
    "cnpj_cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "users_userType_id_fkey" FOREIGN KEY ("userType_id") REFERENCES "UserTypes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "users_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Addresses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserTypes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Addresses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cep" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "street_number" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userType_id_address_id_email_key" ON "users"("userType_id", "address_id", "email");
