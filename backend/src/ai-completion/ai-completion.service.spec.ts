import { Test, TestingModule } from '@nestjs/testing';
import { AiCompletionService } from './ai-completion.service';
import { VideosService } from '../videos/videos.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AiCompletionService', () => {
  let service: AiCompletionService;
  let mockVideosService: {
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockVideosService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiCompletionService,
        {
          provide: VideosService,
          useValue: mockVideosService,
        },
      ],
    }).compile();

    service = module.get<AiCompletionService>(AiCompletionService);
  });

  describe('validation', () => {
    it('should throw NotFoundException when video not found', async () => {
      mockVideosService.findOne.mockResolvedValue(null);

      await expect(
        service.generateCompletion('non-existent-id', 'Summarize: {transcription}'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when transcription not generated', async () => {
      mockVideosService.findOne.mockResolvedValue({
        id: 'uuid-1',
        name: 'test.mp3',
        path: '/tmp/test.mp3',
        mimeType: 'audio/mpeg',
        transcription: null,
        createdAt: new Date(),
      });

      await expect(
        service.generateCompletion('uuid-1', 'Summarize: {transcription}'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when prompt is empty', async () => {
      mockVideosService.findOne.mockResolvedValue({
        id: 'uuid-1',
        name: 'test.mp3',
        path: '/tmp/test.mp3',
        mimeType: 'audio/mpeg',
        transcription: 'Some transcription',
        createdAt: new Date(),
      });

      await expect(
        service.generateCompletion('uuid-1', ''),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('prompt replacement', () => {
    it('should correctly identify that transcription replacement is needed', async () => {
      const video = {
        id: 'uuid-1',
        name: 'test.mp3',
        path: '/tmp/test.mp3',
        mimeType: 'audio/mpeg',
        transcription: 'This is the transcription text',
        createdAt: new Date(),
      };
      mockVideosService.findOne.mockResolvedValue(video);

      const prompt = 'Summarize: {transcription}';
      const expectedReplacedPrompt = 'Summarize: This is the transcription text';

      expect(prompt.replace('{transcription}', video.transcription)).toBe(
        expectedReplacedPrompt,
      );
    });
  });
});
