import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AiCompletionService } from './ai-completion.service';
import { GenerateCompletionDto } from './dto/generate-completion.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('ai-completion')
@Controller('ai')
export class AiCompletionController {
  private readonly logger = new Logger(AiCompletionController.name);

  constructor(private readonly aiCompletionService: AiCompletionService) {}

  @Post('complete')
  @ApiOperation({ summary: 'Generate AI completion from transcription' })
  @ApiResponse({ status: 200, description: 'Streaming completion response' })
  @ApiResponse({ status: 400, description: 'Transcription not generated yet' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async generateCompletion(
    @Body() dto: GenerateCompletionDto,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Generating completion for video: ${dto.videoId}`);

    const response = await this.aiCompletionService.generateCompletion(
      dto.videoId,
      dto.prompt,
      dto.temperature,
    );

    for (const [key, value] of Object.entries(response.headers)) {
      res.setHeader(key, value as string);
    }

    res.status(200);

    const reader = response.body?.getReader();
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    }
  }
}
