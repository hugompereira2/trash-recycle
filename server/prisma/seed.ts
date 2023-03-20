import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const firstHabitId = '0730ffac-d039-4194-9571-01aa2aa0efbd'
const firstHabitCreationDate = new Date('2022-12-31T03:00:00.000')

const secondHabitId = '00880d75-a933-4fef-94ab-e05744435297'
const secondHabitCreationDate = new Date('2023-01-03T03:00:00.000')

const thirdHabitId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00'
const thirdHabitCreationDate = new Date('2023-01-08T03:00:00.000')

async function run() {
  await prisma.user.deleteMany()
  await prisma.address.deleteMany()
  await prisma.userType.deleteMany()

  /**
   * Create habits
   */
  await Promise.all([

    prisma.userType.create({
      data: {
        id: "7635808d-3f19-4543-ad4b-9390bd4b3770",
        name: 'Pessoa Física',
      }
    }),

    prisma.userType.create({
      data: {
        id: "975791b6-e2c6-465f-848b-852811563230",
        name: 'Pessoa Jurídica',
      }
    }),

    prisma.address.create({
      data: {
        cep: '16400-222',
        city: "Lins",
        state: "SP",
        district: "Garcia",
        street: "Rua Nilo Peçanha",
        street_number: "300"
      }
    }),
  ])

  await Promise.all([

    prisma.user.create({
      data: {
        name: "Hugo Mendonça Pereira",
        userType_id: secondHabitId,
        password_hash: "fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00",
        address_id: "fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00",
        cnpj_cpf: "42.480.502/0001-07",
        email: "hugompereira@gmail.com",
        phone: "(14) 99662-2121",
        created_at: thirdHabitCreationDate
      }
    }),

  ])
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })