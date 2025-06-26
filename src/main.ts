import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RolesService } from './roles/roles.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS - cho phép tất cả domain truy cập (chỉ dùng cho dev)
  app.enableCors({
    origin: '*', // Cho phép tất cả domain - CHỈ DÙNG CHO DEV
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, Origin',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  
  // Set global prefix for all APIs
  app.setGlobalPrefix('api');
  
  // Configure body parser for file uploads
  app.use('/upload', (req, res, next) => {
    console.log('📥 Upload request received:', {
      method: req.method,
      url: req.url,
      contentType: req.headers['content-type'],
      contentLength: req.headers['content-length'],
    });
    next();
  });
  
  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());
    // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Hello VPS API')
    .setDescription('API documentation for authentication, user management, and file upload services')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Initialize default roles
  const rolesService = app.get(RolesService);
  await rolesService.initializeDefaultRoles();
    await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Application is running on: http://localhost:3000');
  console.log('📚 Swagger documentation: http://localhost:3000/api');
}

void bootstrap();
