import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';

/**
 * DTO for updating an existing member
 */
export class UpdateMemberDto extends PartialType(CreateMemberDto) {}