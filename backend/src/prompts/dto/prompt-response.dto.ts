import { ApiProperty } from '@nestjs/swagger';

export class PromptResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  template: string;
}
