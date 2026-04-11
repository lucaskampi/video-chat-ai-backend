import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Video } from './entities/video.entity';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pump = promisify(pipeline);

const ALLOWED_EXTENSIONS = ['.mp3', '.mp4', '.wav', '.m4a', '.webm', '.weba'];
const ALLOWED_MIME_TYPES = [
  'audio/mpeg',
  'video/mp4',
  'audio/wav',
  'audio/mp4',
  'video/webm',
  'audio/webm',
];
const MAX_FILE_SIZE = 50 * 1024 * 1024;

@Injectable()
export class VideosService {
  private readonly logger = new Logger(VideosService.name);
  private uploadDir: string;

  constructor(private readonly prisma: PrismaService) {
    this.uploadDir = path.resolve(__dirname, '../../../tmp');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Missing file input');
    }

    const extension = path.extname(file.originalname).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`,
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid MIME type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }
  }

  async create(file: Express.Multer.File): Promise<Video> {
    this.validateFile(file);

    const extension = path.extname(file.originalname).toLowerCase();
    const fileBaseName = path.basename(file.originalname, extension);
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;
    const uploadDestination = path.join(this.uploadDir, fileUploadName);

    const writeStream = fs.createWriteStream(uploadDestination);
    await pump(file.buffer, writeStream);

    const video = await this.prisma.video.create({
      data: {
        name: file.originalname,
        path: uploadDestination,
        mimeType: file.mimetype,
      },
    });

    this.logger.log(`Video created: ${video.id} - ${video.name}`);

    return {
      id: video.id,
      name: video.name,
      path: video.path,
      mimeType: video.mimeType,
      transcription: video.transcription,
      createdAt: video.createdAt,
    };
  }

  async findAll(): Promise<Video[]> {
    const videos = await this.prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return videos.map((video) => ({
      id: video.id,
      name: video.name,
      path: video.path,
      mimeType: video.mimeType,
      transcription: video.transcription,
      createdAt: video.createdAt,
    }));
  }

  async findOne(id: string): Promise<Video | null> {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return null;
    }

    return {
      id: video.id,
      name: video.name,
      path: video.path,
      mimeType: video.mimeType,
      transcription: video.transcription,
      createdAt: video.createdAt,
    };
  }

  async remove(id: string): Promise<void> {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    if (fs.existsSync(video.path)) {
      fs.unlinkSync(video.path);
    }

    await this.prisma.video.delete({
      where: { id },
    });

    this.logger.log(`Video deleted: ${id}`);
  }
}
