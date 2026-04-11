import { Test, TestingModule } from '@nestjs/testing';
import { PromptsService } from './prompts.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PromptsService', () => {
  let service: PromptsService;
  let mockPrisma: {
    prompt: {
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    mockPrisma = {
      prompt: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromptsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<PromptsService>(PromptsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all prompts', async () => {
      const mockPrompts = [
        {
          id: '11111111-1111-1111-1111-111111111111',
          title: 'YouTube Title',
          template: 'Generate a title: {transcription}',
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          title: 'YouTube Description',
          template: 'Generate a description: {transcription}',
        },
      ];

      mockPrisma.prompt.findMany.mockResolvedValue(mockPrompts);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: '11111111-1111-1111-1111-111111111111',
        title: 'YouTube Title',
        template: 'Generate a title: {transcription}',
      });
      expect(result[1]).toEqual({
        id: '22222222-2222-2222-2222-222222222222',
        title: 'YouTube Description',
        template: 'Generate a description: {transcription}',
      });
      expect(mockPrisma.prompt.findMany).toHaveBeenCalled();
    });

    it('should return empty array when no prompts exist', async () => {
      mockPrisma.prompt.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });
});
