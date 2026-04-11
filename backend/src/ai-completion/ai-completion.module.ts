import { Module } from '@nestjs/common';
import { AiCompletionController } from './ai-completion.controller';
import { AiCompletionService } from './ai-completion.service';
import { VideosModule } from '../videos/videos.module';

@Module({
  imports: [VideosModule],
  controllers: [AiCompletionController],
  providers: [AiCompletionService],
  exports: [AiCompletionService],
})
export class AiCompletionModule {}
