import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoDto {
  @ApiProperty({ description: 'Video file' })
  file: Express.Multer.File;
}
