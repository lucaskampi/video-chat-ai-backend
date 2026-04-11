import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { VideoResponseDto } from './dto/video-response.dto';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  private readonly logger = new Logger(VideosController.name);

  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload audio/video file' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully', type: VideoResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  async create(@UploadedFile() file: Express.Multer.File) {
    this.logger.log(`Uploading file: ${file.originalname}`);
    const video = await this.videosService.create(file);
    return { data: video };
  }

  @Get()
  @ApiOperation({ summary: 'Get all videos' })
  @ApiResponse({ status: 200, description: 'List of all videos', type: [VideoResponseDto] })
  async findAll() {
    const videos = await this.videosService.findAll();
    return { data: videos };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get video by ID' })
  @ApiResponse({ status: 200, description: 'Video details', type: VideoResponseDto })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const video = await this.videosService.findOne(id);
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    return { data: video };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete video' })
  @ApiResponse({ status: 204, description: 'Video deleted successfully' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting video: ${id}`);
    await this.videosService.remove(id);
  }
}
