import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { VideosService } from '../videos/videos.service';
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

@Injectable()
export class AiCompletionService {
  private readonly logger = new Logger(AiCompletionService.name);
  private openai: OpenAI;

  constructor(private readonly videosService: VideosService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateCompletion(
    videoId: string,
    prompt: string,
    temperature: number = 0.5,
  ): Promise<StreamingTextResponse> {
    const video = await this.videosService.findOne(videoId);

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    if (!video.transcription) {
      throw new BadRequestException(
        'Video transcription has not been generated yet',
      );
    }

    if (!prompt || prompt.trim().length === 0) {
      throw new BadRequestException('Prompt is required');
    }

    this.logger.log(`Generating completion for video: ${videoId}`);

    const promptMessage = prompt.replace('{transcription}', video.transcription);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature,
      messages: [{ role: 'user', content: promptMessage }],
      stream: true,
    });

    const stream = OpenAIStream(response as any);

    return new StreamingTextResponse(stream);
  }
}
