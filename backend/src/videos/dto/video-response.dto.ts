import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VideoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  mimeType: string;

  @ApiPropertyOptional()
  transcription: string | null;

  @ApiProperty()
  createdAt: Date;
}

export class VideoListResponseDto {
  @ApiProperty({ type: VideoResponseDto, isArray: true })
  data: VideoResponseDto[];
}
