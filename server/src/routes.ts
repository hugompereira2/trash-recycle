import dayjs from "dayjs"
import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "./lib/prisma"
import { genSaltSync, hashSync, compareSync } from "bcryptjs"

interface Address {
  cep: String
  city: String
  state: String
  district: String
  street: String
  street_number: String
}

type userResponse = {
  name: String
  cnpj_cpf: String
  email: String
  password_hash?: String
  address_id?: null | String
  phone: String
  address?: null | Address
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
          street_number: z.string().optional(),
        }).optional()
      })

      const registerBody = createRegisterBody.parse(request.body)

      // console.log(registerBody);

      let address = null;

      if (registerBody.address) {
        address = await prisma.address.create({
          data: {
            cep: registerBody.address.cep,
            city: registerBody.address.city,
            state: registerBody.address.state,
            district: registerBody.address.district,
            street: registerBody.address.street,
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

      const userCreated: userResponse = {
        ...user,
        address: address
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
      })

      const passwordCorrect = compareSync(userLoginBody.password, user!.password_hash);

      if (passwordCorrect) {
        return user
      }

      return false;
    } catch (error) {
      return false
    }
  })

  app.post('/update', async (request) => {
    try {
      const createUserUpdateBody = z.object({
        name: z.string(),
        email: z.string(),
        cnpj_cpf: z.string(),
        whatsapp: z.string(),
      })

      const userUpdateBody = createUserUpdateBody.parse(request.body)

      const user = await prisma.user.update({
        where: {
          email: userUpdateBody.email
        },
        data: {
          name: userUpdateBody.name,
          email: userUpdateBody.email,
          cnpj_cpf: userUpdateBody.cnpj_cpf,
          phone: userUpdateBody.whatsapp,
        },
      })
      return user;
    } catch (error) {
      return error;
    }
  })

  // app.patch('/habits/:id/toggle', async (request) => {
  //   const toggleHabitParams = z.object({
  //     id: z.string().uuid()
  //   })

  //   const { id } = toggleHabitParams.parse(request.params)

  //   const today = dayjs().startOf('day').toDate()

  //   let day = await prisma.day.findUnique({
  //     where: {
  //       date: today
  //     }
  //   })

  //   if (!day) {
  //     day = await prisma.day.create({
  //       data: {
  //         date: today
  //       }
  //     })
  //   }

  //   const dayHabit = await prisma.dayHabit.findUnique({
  //     where: {
  //       day_id_habit_id: {
  //         day_id: day.id,
  //         habit_id: id
  //       }
  //     }
  //   })

  //   if (dayHabit) {
  //     await prisma.dayHabit.delete({
  //       where: {
  //         id: dayHabit.id
  //       }
  //     })
  //   } else {
  //     await prisma.dayHabit.create({
  //       data: {
  //         day_id: day.id,
  //         habit_id: id
  //       }
  //     })
  //   }
  // })

  // app.get('/summary', async () => {
  //   const summary = await prisma.$queryRaw`
  //     SELECT 
  //       D.id, 
  //       D.date,
  //       (
  //         SELECT 
  //           cast(count(*) as float)
  //         FROM day_habits DH
  //         WHERE DH.day_id = D.id
  //       ) as completed,
  //       (
  //         SELECT
  //           cast(count(*) as float)
  //         FROM habit_week_days HDW
  //         JOIN habits H
  //           ON H.id = HDW.habit_id
  //         WHERE
  //           HDW.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
  //           AND H.created_at <= D.date
  //       ) as amount
  //     FROM days D
  //   `

  //   return summary
  // })
}
