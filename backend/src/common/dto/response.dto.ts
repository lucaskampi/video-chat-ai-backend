import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty()
  data: T;
}

export class MetaDto {
  @ApiProperty()
  total?: number;

  @ApiProperty()
  page?: number;

  @ApiProperty()
  limit?: number;
}

export class PaginatedResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
