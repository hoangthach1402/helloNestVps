import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUrl, IsOptional } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ 
    type: 'string', 
    format: 'binary',
    description: 'Image file to upload (JPEG, PNG, GIF, WebP)',
    example: 'image.jpg'
  })
  file: any;
}

export class MultipleFileUploadDto {
  @ApiProperty({ 
    type: 'array', 
    items: { type: 'string', format: 'binary' },
    description: 'Multiple image files to upload (max 10 files)',
    example: ['image1.jpg', 'image2.png']
  })
  files: any[];
}

export class UploadResponseDto {
  @ApiProperty({ 
    example: 'Image uploaded successfully',
    description: 'Success message'
  })
  @IsString()
  message: string;

  @ApiProperty({ 
    example: 'https://res.cloudinary.com/cugia94/image/upload/v1234567890/hello-vps/abc123.jpg',
    description: 'Secure URL of uploaded image'
  })
  @IsUrl()
  url: string;

  @ApiProperty({ 
    example: 'hello-vps/abc123',
    description: 'Cloudinary public ID'
  })
  @IsString()
  publicId: string;

  @ApiProperty({ 
    example: 1920,
    description: 'Image width in pixels'
  })
  @IsNumber()
  width: number;

  @ApiProperty({ 
    example: 1080,
    description: 'Image height in pixels'
  })
  @IsNumber()
  height: number;

  @ApiProperty({ 
    example: 'jpg',
    description: 'Image format'
  })
  @IsString()
  format: string;

  @ApiProperty({ 
    example: 245760,
    description: 'File size in bytes'
  })
  @IsNumber()
  size: number;
}

export class MultipleUploadResponseDto {
  @ApiProperty({ 
    example: '3 images uploaded successfully',
    description: 'Success message with count'
  })
  @IsString()
  message: string;

  @ApiProperty({ 
    type: [UploadResponseDto],
    description: 'Array of uploaded image details'
  })
  images: Omit<UploadResponseDto, 'message'>[];
}

export class UploadErrorDto {
  @ApiProperty({ 
    example: 'Upload failed: Invalid file type',
    description: 'Error message'
  })
  @IsString()
  message: string;

  @ApiProperty({ 
    example: 'Bad Request',
    description: 'Error type'
  })
  @IsString()
  error: string;

  @ApiProperty({ 
    example: 400,
    description: 'HTTP status code'
  })
  @IsNumber()
  statusCode: number;
}

export class DeleteImageDto {
  @ApiProperty({ 
    example: 'hello-vps/zb5fmnx1rodcgqjsqqoi',
    description: 'Cloudinary public ID of the image to delete'
  })
  @IsString()
  publicId: string;
}

export class DeleteImageResponseDto {
  @ApiProperty({ 
    example: 'Image deleted successfully',
    description: 'Success message'
  })
  @IsString()
  message: string;

  @ApiProperty({ 
    example: 'hello-vps/zb5fmnx1rodcgqjsqqoi',
    description: 'Public ID of deleted image'
  })
  @IsString()
  publicId: string;

  @ApiProperty({ 
    example: 'ok',
    description: 'Cloudinary deletion result'
  })
  @IsString()
  result: string;
}
