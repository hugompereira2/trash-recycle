import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function run() {
  await prisma.address.deleteMany()
  await prisma.materialUser.deleteMany()
  await prisma.user.deleteMany()
  await prisma.userType.deleteMany()
  await prisma.material.deleteMany()

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

    prisma.material.create({
      data: {
        name: 'Papel',
        color: '#0268d3',
      }
    }),

    prisma.material.create({
      data: {
        name: 'Plastico',
        color: '#ed0007',
      }
    }),

    prisma.material.create({
      data: {
        name: 'Metal',
        color: '#fad002',
      }
    }),

    // prisma.material.create({
    //   data: {
    //     name: 'Organico',
    //     color: '#834125',
    //   }
    // }),

    prisma.material.create({
      data: {
        name: 'Vidro',
        color: '#01a447',
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