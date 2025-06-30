import { PartialType } from '@nestjs/mapped-types';
import { CreateBillDto } from './create-bill.dto';

/**
 * DTO for updating an existing bill
 */
export class UpdateBillDto extends PartialType(CreateBillDto) {}