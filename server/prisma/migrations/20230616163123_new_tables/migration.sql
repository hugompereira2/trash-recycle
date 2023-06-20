-- CreateTable
CREATE TABLE "solicitationUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client_user_id" TEXT NOT NULL,
    "company_user_id" TEXT NOT NULL,
    CONSTRAINT "solicitationUser_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "solicitationUser_company_user_id_fkey" FOREIGN KEY ("company_user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "solicitationMaterial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "solicitation_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    CONSTRAINT "solicitationMaterial_solicitation_id_fkey" FOREIGN KEY ("solicitation_id") REFERENCES "solicitationUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "solicitationMaterial_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
