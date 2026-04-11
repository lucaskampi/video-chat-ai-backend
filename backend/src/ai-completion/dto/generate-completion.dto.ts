import { IsUUID, IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateCompletionDto {
  @ApiProperty({ description: 'Video ID' })
  @IsUUID()
  videoId: string;

  @ApiProperty({ description: 'Prompt template with {transcription} placeholder' })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({ description: 'Temperature for generation', default: 0.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature?: number = 0.5;
}
