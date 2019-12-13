import { Photon } from '@prisma/photon'
const photon = new Photon()

async function main() {
  await photon.posts.create({
    data: {
      title: 'Watch the talks from Prisma Day 2019',
      content: 'https://www.prisma.io/blog/z11sg6ipb3i1/',
      published: true,
    },
  })
  await photon.posts.create({
    data: {
      title: 'Subscribe to GraphQL Weekly for community news',
      content: 'https://graphqlweekly.com/',
      published: true,
    },
  })
  await photon.posts.create({
    data: {
      title: 'Follow Prisma on Twitter',
      content: 'https://twitter.com/prisma/',
      published: false,
    },
  })
}

main().finally(async () => {
  await photon.disconnect()
})
