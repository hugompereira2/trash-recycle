/*
  Warnings:

  - A unique constraint covering the columns `[address_id,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_userType_id_address_id_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "users_address_id_email_key" ON "users"("address_id", "email");
