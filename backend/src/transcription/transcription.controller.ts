import { Controller, Post, Param, Body, ParseUUIDPipe, Logger } from '@nestjs/common';
import { TranscriptionService } from './transcription.service';
import { ApiTags, ApiOperation, ApiResponse, ApiPropertyOptional } from '@nestjs/swagger';

class CreateTranscriptionDto {
  @ApiPropertyOptional()
  prompt?: string;
}

@ApiTags('transcription')
@Controller('videos')
export class TranscriptionController {
  private readonly logger = new Logger(TranscriptionController.name);

  constructor(private readonly transcriptionService: TranscriptionService) {}

  @Post(':videoId/transcription')
  @ApiOperation({ summary: 'Generate transcription for a video' })
  @ApiResponse({ status: 201, description: 'Transcription generated successfully' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async createTranscription(
    @Param('videoId', ParseUUIDPipe) videoId: string,
    @Body() dto: CreateTranscriptionDto,
  ) {
    this.logger.log(`Generating transcription for video: ${videoId}`);
    const transcription = await this.transcriptionService.createTranscription(
      videoId,
      dto.prompt,
    );
    return { data: transcription };
  }
}
