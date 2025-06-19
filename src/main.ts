import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { RolesService } from './roles/roles.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());
  
  // Initialize default roles
  const rolesService = app.get(RolesService);
  await rolesService.initializeDefaultRoles();
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
