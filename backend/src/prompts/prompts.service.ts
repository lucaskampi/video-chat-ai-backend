import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prompt } from './entities/prompt.entity';

@Injectable()
export class PromptsService {
  private readonly logger = new Logger(PromptsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Prompt[]> {
    const prompts = await this.prisma.prompt.findMany();
    this.logger.log(`Found ${prompts.length} prompts`);
    return prompts.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      template: prompt.template,
    }));
  }
}
