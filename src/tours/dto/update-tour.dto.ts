import { PartialType } from '@nestjs/mapped-types';
import { CreateTourDto } from './create-tour.dto';

/**
 * DTO for updating an existing tour
 */
export class UpdateTourDto extends PartialType(CreateTourDto) {}