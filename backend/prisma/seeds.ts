import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.prompt.deleteMany();

  await prisma.prompt.createMany({
    data: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        title: 'YouTube Title',
        template:
          'Based on the following transcription, generate an engaging YouTube video title. The title should be catchy, descriptive, and under 60 characters:\n\n{transcription}',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        title: 'YouTube Description',
        template:
          'Based on the following transcription, generate a detailed YouTube video description. Include a summary of the content, relevant keywords, and timestamps:\n\n{transcription}',
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        title: 'Summary',
        template:
          'Provide a concise summary of the following transcription in 2-3 sentences:\n\n{transcription}',
      },
    ],
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
