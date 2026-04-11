import { Test, TestingModule } from '@nestjs/testing';
import { VideosService } from './videos.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('VideosService', () => {
  let service: VideosService;
  let mockPrisma: {
    video: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    mockPrisma = {
      video: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
  });

  describe('validateFile', () => {
    it('should throw BadRequestException when file is missing', () => {
      expect(() => (service as any).validateFile(null)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid file extension', () => {
      const mockFile = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test'),
      };

      expect(() => (service as any).validateFile(mockFile)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid MIME type', () => {
      const mockFile = {
        originalname: 'test.mp3',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test'),
      };

      expect(() => (service as any).validateFile(mockFile)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when file size exceeds limit', () => {
      const mockFile = {
        originalname: 'test.mp3',
        mimetype: 'audio/mpeg',
        size: 100 * 1024 * 1024,
        buffer: Buffer.from('test'),
      };

      expect(() => (service as any).validateFile(mockFile)).toThrow(
        BadRequestException,
      );
    });

    it('should not throw for valid file', () => {
      const mockFile = {
        originalname: 'test.mp3',
        mimetype: 'audio/mpeg',
        size: 1024,
        buffer: Buffer.from('test'),
      };

      expect(() => (service as any).validateFile(mockFile)).not.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all videos', async () => {
      const mockVideos = [
        {
          id: 'uuid-1',
          name: 'test1.mp3',
          path: '/tmp/test1.mp3',
          mimeType: 'audio/mpeg',
          transcription: null,
          createdAt: new Date(),
        },
        {
          id: 'uuid-2',
          name: 'test2.mp3',
          path: '/tmp/test2.mp3',
          mimeType: 'audio/mpeg',
          transcription: 'transcribed text',
          createdAt: new Date(),
        },
      ];

      mockPrisma.video.findMany.mockResolvedValue(mockVideos);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('test1.mp3');
      expect(result[1].transcription).toBe('transcribed text');
    });

    it('should return empty array when no videos exist', async () => {
      mockPrisma.video.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a video by id', async () => {
      const mockVideo = {
        id: 'uuid-1',
        name: 'test.mp3',
        path: '/tmp/test.mp3',
        mimeType: 'audio/mpeg',
        transcription: null,
        createdAt: new Date(),
      };

      mockPrisma.video.findUnique.mockResolvedValue(mockVideo);

      const result = await service.findOne('uuid-1');

      expect(result).toEqual({
        id: mockVideo.id,
        name: mockVideo.name,
        path: mockVideo.path,
        mimeType: mockVideo.mimeType,
        transcription: mockVideo.transcription,
        createdAt: mockVideo.createdAt,
      });
    });

    it('should return null when video not found', async () => {
      mockPrisma.video.findUnique.mockResolvedValue(null);

      const result = await service.findOne('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when video not found', async () => {
      mockPrisma.video.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
