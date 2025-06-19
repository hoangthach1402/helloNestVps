import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { CloudinaryService } from './cloudinary.service';
import { FileValidationService } from './file-validation.service';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [CloudinaryService, FileValidationService],
  exports: [CloudinaryService, FileValidationService],
})
export class UploadModule {}
