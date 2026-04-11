import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Videos (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/videos (GET)', () => {
    it('should return empty array when no videos exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/videos')
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('/videos/:id (GET)', () => {
    it('should return 404 for non-existent video', async () => {
      await request(app.getHttpServer())
        .get('/videos/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('/videos/:id (DELETE)', () => {
    it('should return 404 for non-existent video', async () => {
      const nonExistentUuid = '550e8400-e29b-41d4-a716-446655440000';
      await request(app.getHttpServer())
        .delete(`/videos/${nonExistentUuid}`)
        .expect(404);
    });
  });
});
