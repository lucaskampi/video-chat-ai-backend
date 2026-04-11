import { Module } from '@nestjs/common';
import { VideosModule } from './videos/videos.module';
import { TranscriptionModule } from './transcription/transcription.module';
import { AiCompletionModule } from './ai-completion/ai-completion.module';
import { PromptsModule } from './prompts/prompts.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    VideosModule,
    TranscriptionModule,
    AiCompletionModule,
    PromptsModule,
  ],
})
export class AppModule {}
