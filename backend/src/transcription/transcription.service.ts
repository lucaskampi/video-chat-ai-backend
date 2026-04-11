import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VideosService } from '../videos/videos.service';
import OpenAI from 'openai';
import { createReadStream } from 'fs';

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);
  private openai: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly videosService: VideosService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async createTranscription(
    videoId: string,
    prompt?: string,
  ): Promise<{ transcription: string }> {
    const video = await this.videosService.findOne(videoId);

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    if (!video.path) {
      throw new BadRequestException('Video path is missing');
    }

    this.logger.log(`Starting transcription for video: ${videoId}`);

    const audioReadStream = createReadStream(video.path);

    const response = await this.openai.audio.transcriptions.create({
      file: audioReadStream,
      model: 'whisper-1',
      language: 'en',
      response_format: 'json',
      temperature: 0,
      prompt,
    });

    const transcription = response.text;

    await this.prisma.video.update({
      where: { id: videoId },
      data: { transcription },
    });

    this.logger.log(`Transcription completed for video: ${videoId}`);

    return { transcription };
  }
}
