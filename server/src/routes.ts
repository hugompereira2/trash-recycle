import dayjs from "dayjs"
import { FastifyInstance } from "fastify"
import { string, z } from "zod"
import { prisma } from "./lib/prisma"
import { genSaltSync, hashSync, compareSync } from "bcryptjs"

interface Address {
  cep: string;
  city: string;
  state: string;
  district: string;
  street: string;
  street_number?: string | null;
  location: string;
}

type userResponse = {
  id?: string;
  name: string;
  cnpj_cpf: string;
  email: string;
  password_hash?: string;
  address_id?: string | null;
  phone: string;
  address?: Address | null;
  materialUser?: { material_id: string }[]
}

export async function appRoutes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    try {
      const createRegisterBody = z.object({
        name: z.string(),
        userType_id: z.string(),
        cnpj_cpf: z.string(),
        email: z.string(),
        password: z.string(),
        whatsapp: z.string(),
        address: z.object({
          cep: z.string(),
          city: z.string(),
          state: z.string(),
          district: z.string(),
          street: z.string(),
          location: z.array(z.number(), z.number()),
          street_number: z.string().optional()
        }).optional(),
        materialUser: z.array(z.string()).optional(),
      })

      const registerBody = createRegisterBody.parse(request.body)

      let address = null;
      if (registerBody.address) {
        address = await prisma.address.create({
          data: {
            cep: registerBody.address.cep,
            city: registerBody.address.city,
            state: registerBody.address.state,
            district: registerBody.address.district,
            street: registerBody.address.street,
            location: String(registerBody.address.location),
            street_number: String(registerBody.address.street_number),
          }
        })
      }

      const salt = genSaltSync(10);
      const hash = hashSync(registerBody.password, salt);

      const today = dayjs().startOf('day').toDate();

      const user = await prisma.user.create({
        data: {
          name: registerBody.name,
          userType_id: registerBody.userType_id,
          address_id: address ? address.id : null,
          cnpj_cpf: registerBody.cnpj_cpf,
          password_hash: hash,
          email: registerBody.email,
          phone: registerBody.whatsapp,
          created_at: today
        }
      })

      let materialList: { material_id: string }[] = [];

      if (registerBody.materialUser) {
        await Promise.all(
          registerBody.materialUser.map(async (material_id) => {
            const material = await prisma.materialUser.create({
              data: {
                user_id: user.id,
                material_id: material_id,
              }
            });
            materialList.push({ "material_id": material.material_id });
          })
        );
      }

      const userCreated: userResponse = {
        ...user,
        address: address,
        materialUser: materialList
      }

      delete userCreated.password_hash
      delete userCreated.address_id

      return userCreated;
    } catch (error) {
      return error;
    }

  })

  app.post('/login', async (request) => {
    try {
      const createUserLoginBody = z.object({
        email: z.string(),
        password: z.string(),
      })

      const userLoginBody = createUserLoginBody.parse(request.body)

      const user = await prisma.user.findFirst({
        where: {
          email: userLoginBody.email
        },
        include: {
          address: true,
          materialUser: { select: { material_id: true } },
        },
      })

      if (user) {
        const passwordCorrect = compareSync(userLoginBody.password, user.password_hash!);

        if (passwordCorrect) {

          // destructuring
          const { password_hash: ph, address_id: ai, ...newObjUser } = user;

          return newObjUser;
        }
      }

      return false;
    } catch (error) {
      return error
    }
  })

  app.post('/update', async (request) => {
    try {
      const createUserUpdateBody = z.object({
        name: z.string(),
        cnpj_cpf: z.string(),
        email: z.string(),
        whatsapp: z.string(),
        address: z.object({
          cep: z.string(),
          city: z.string(),
          state: z.string(),
          district: z.string(),
          street: z.string(),
          location: z.array(z.number(), z.number()),
          street_number: z.string().optional()
        }).nullable().optional(),
        materialUser: z.object({ material_id: z.string() }).array().optional(),
      })

      const userUpdateBody = createUserUpdateBody.parse(request.body)

      let user: userResponse;

      user = await prisma.user.update({
        where: {
          email: userUpdateBody.email
        },
        data: {
          name: userUpdateBody.name,
          cnpj_cpf: userUpdateBody.cnpj_cpf,
          phone: userUpdateBody.whatsapp,
        },
      })

      if (user?.address_id) {
        user.address = await prisma.address.update({
          where: {
            id: user.address_id
          },
          data: {
            cep: userUpdateBody.address?.cep,
            city: userUpdateBody.address?.city,
            state: userUpdateBody.address?.state,
            district: userUpdateBody.address?.district,
            street: userUpdateBody.address?.street,
            location: String(userUpdateBody.address?.location),
            street_number: userUpdateBody.address?.street_number,
          },
        })

        await prisma.materialUser.deleteMany({
          where: {
            user_id: user.id
          }
        })

        let materialList: { material_id: string }[] = [];

        await Promise.all(
          userUpdateBody.materialUser!.map(async (material) => {
            const materialCreated = await prisma.materialUser.create({
              data: {
                user_id: user.id!,
                material_id: material.material_id,
              },
            })
            materialList.push({ "material_id": materialCreated.material_id });
          })
        );
        user.materialUser = materialList;
      }

      delete user.password_hash;
      delete user.address_id;

      return user;
    } catch (error) {
      return error;
    }
  })

  app.get('/findAllMaterials', async () => {
    try {
      const materials = await prisma.material.findMany();

      return materials;

    } catch (error) {
      return error;
    }
  })

  app.get('/validateEmail/:id', async (request) => {
    try {

      const createEmailBody = z.object({ id: z.string() });
      const emailGetBody = createEmailBody.parse(request.params);

      const user = await prisma.user.findFirst({
        where: {
          email: emailGetBody.id
        }
      })

      if (user) {
        return false;
      }

      return true;

    } catch (error) {
      return error;
    }
  })

  app.get('/findByMaterial', async (request) => {
    try {

      const createMaterialsBody = z.object({ materials: z.string() });
      const materialsGetBody = (createMaterialsBody.parse(request.query)).materials;

      const materials = materialsGetBody.split(",");

      const user = await prisma.user.findMany({
        where: {
          materialUser: {
            some: {
              Material: {
                id: {
                  in: materials
                }
              }
            }
          },
          address_id: {
            not: null,
          },
        },
        select: {
          name: true,
          address: {
            select: {
              cep: true,
              city: true,
              state: true,
              district: true,
              street: true,
              location: true,
              street_number: true
            }
          },
          materialUser: {
            select: {
              Material: {
                select: {
                  id: true,
                  name: true,
                  color: true
                }
              }
            }
          }
        }
      });

      const modifiedUser = user.map((u) => ({
        ...u,
        materialUser: u.materialUser.map((mu) => mu.Material)
      }));

      return modifiedUser;

    } catch (error) {
      return error;
    }
  })
}
