import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiConsumes, 
  ApiBody
} from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';
import { FileValidationService } from './file-validation.service';
import { 
  FileUploadDto, 
  MultipleFileUploadDto, 
  UploadResponseDto, 
  MultipleUploadResponseDto, 
  UploadErrorDto 
} from './dto/upload.dto';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly fileValidationService: FileValidationService,
  ) {}@Post('image')
  @ApiOperation({ 
    summary: 'Upload single image',
    description: 'Upload a single image file to Cloudinary. Supports JPEG, PNG, GIF, WebP formats. Max file size: 5MB.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to upload',
    type: FileUploadDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully',
    type: UploadResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file type, size, or missing file',
    type: UploadErrorDto
  })  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<UploadResponseDto> {
    console.log('📁 Upload request received:', {
      hasFile: !!file,
      filename: file?.originalname,
      size: file?.size,
      mimetype: file?.mimetype,
    });

    this.fileValidationService.validateFile(file);

    try {
      const result = await this.cloudinaryService.uploadImage(file);
      
      return {
        message: 'Image uploaded successfully',
        ...this.fileValidationService.formatUploadResponse(result),
      };
    } catch (error) {
      console.error('🚨 Upload controller error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new BadRequestException(`Upload failed: ${errorMessage}`);
    }
  }@Post('images')
  @ApiOperation({ 
    summary: 'Upload multiple images',
    description: 'Upload multiple image files to Cloudinary. Supports JPEG, PNG, GIF, WebP formats. Max 10 files per request, 5MB per file.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple image files to upload',
    type: MultipleFileUploadDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Images uploaded successfully',
    type: MultipleUploadResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file type, size, or missing files',
    type: UploadErrorDto
  })  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]): Promise<MultipleUploadResponseDto> {
    this.fileValidationService.validateFiles(files);

    try {
      const results = await this.cloudinaryService.uploadMultipleImages(files);
      
      return {
        message: `${results.length} images uploaded successfully`,
        images: results.map(result => this.fileValidationService.formatUploadResponse(result)),
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }
}
