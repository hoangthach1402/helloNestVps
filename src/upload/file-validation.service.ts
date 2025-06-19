import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationService {
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private readonly maxSize = 5 * 1024 * 1024; // 5MB

  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
      );
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException(
        'File too large. Maximum size is 5MB.',
      );
    }
  }

  validateFiles(files: Express.Multer.File[]): void {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    for (const file of files) {
      if (!this.allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Invalid file type for ${file.originalname}. Only JPEG, PNG, GIF, and WebP are allowed.`,
        );
      }
      if (file.size > this.maxSize) {
        throw new BadRequestException(
          `File ${file.originalname} is too large. Maximum size is 5MB.`,
        );
      }
    }
  }

  formatUploadResponse(result: any): any {
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
    };
  }
}