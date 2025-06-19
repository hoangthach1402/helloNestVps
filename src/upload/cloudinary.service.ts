import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'hello-vps',
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('🔧 Cloudinary config check:', {
        cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
        api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
        api_secret_length: this.configService.get<string>('CLOUDINARY_API_SECRET')?.length || 0,
        file_size: file.size,
        file_mimetype: file.mimetype,
        file_originalname: file.originalname,
      });

      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: folder,
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(new Error(`Cloudinary error: ${error.message || 'Unknown error'}`));
          } else if (result) {
            console.log('✅ Cloudinary upload success:', {
              public_id: result.public_id,
              secure_url: result.secure_url,
              width: result.width,
              height: result.height,
            });
            resolve(result);
          } else {
            console.error('❌ Cloudinary upload failed: No result returned');
            reject(new Error('Cloudinary upload failed: No result returned'));
          }
        },
      ).end(file.buffer);
    });
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: string = 'hello-vps',
  ): Promise<any[]> {
    const uploadPromises = files.map((file) =>
      this.uploadImage(file, folder),
    );
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }
}
