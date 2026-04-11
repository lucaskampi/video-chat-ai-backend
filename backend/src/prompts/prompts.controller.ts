import { Controller, Get, Logger } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { Prompt } from './entities/prompt.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PromptResponseDto } from './dto/prompt-response.dto';

@ApiTags('prompts')
@Controller('prompts')
export class PromptsController {
  private readonly logger = new Logger(PromptsController.name);

  constructor(private readonly promptsService: PromptsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all prompts' })
  @ApiResponse({ status: 200, description: 'List of all prompts', type: [PromptResponseDto] })
  async findAll() {
    const prompts = await this.promptsService.findAll();
    return { data: prompts };
  }
}
