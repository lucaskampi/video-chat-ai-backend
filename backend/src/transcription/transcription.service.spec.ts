import { Test, TestingModule } from '@nestjs/testing';
import { TranscriptionService } from './transcription.service';
import { PrismaService } from '../prisma/prisma.service';
import { VideosService } from '../videos/videos.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    audio: {
      transcriptions: {
        create: jest.fn().mockResolvedValue({ text: 'Transcribed text content' }),
      },
    },
  }));
});

describe('TranscriptionService', () => {
  let service: TranscriptionService;
  let mockPrisma: {
    video: {
      update: jest.Mock;
    };
  };
  let mockVideosService: {
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    mockPrisma = {
      video: {
        update: jest.fn(),
      },
    };

    mockVideosService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranscriptionService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: VideosService,
          useValue: mockVideosService,
        },
      ],
    }).compile();

    service = module.get<TranscriptionService>(TranscriptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTranscription', () => {
    const mockVideo = {
      id: 'uuid-1',
      name: 'test.mp3',
      path: '/tmp/test.mp3',
      mimeType: 'audio/mpeg',
      transcription: null,
      createdAt: new Date(),
    };

    it('should create transcription successfully', async () => {
      mockVideosService.findOne.mockResolvedValue(mockVideo);
      mockPrisma.video.update.mockResolvedValue({
        ...mockVideo,
        transcription: 'Transcribed text content',
      });

      const result = await service.createTranscription('uuid-1');

      expect(result).toEqual({ transcription: 'Transcribed text content' });
      expect(mockVideosService.findOne).toHaveBeenCalledWith('uuid-1');
      expect(mockPrisma.video.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        data: { transcription: 'Transcribed text content' },
      });
    });

    it('should create transcription with prompt hint', async () => {
      mockVideosService.findOne.mockResolvedValue(mockVideo);
      mockPrisma.video.update.mockResolvedValue({
        ...mockVideo,
        transcription: 'Transcribed text content',
      });

      const result = await service.createTranscription('uuid-1', 'Speaker A');

      expect(result).toEqual({ transcription: 'Transcribed text content' });
    });

    it('should throw NotFoundException when video not found', async () => {
      mockVideosService.findOne.mockResolvedValue(null);

      await expect(
        service.createTranscription('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when video path is missing', async () => {
      mockVideosService.findOne.mockResolvedValue({
        ...mockVideo,
        path: null,
      });

      await expect(service.createTranscription('uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
