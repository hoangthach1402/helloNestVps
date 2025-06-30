import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

/**
 * Controller for managing members
 * No authorization required as per user request
 */
@Controller('owners/:ownerId/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  /**
   * Create a new member for a specific owner
   * POST /owners/:ownerId/members
   */
  @Post()
  create(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Body() createMemberDto: CreateMemberDto,
  ) {
    return this.membersService.create(ownerId, createMemberDto);
  }

  /**
   * Get all members for a specific owner
   * GET /owners/:ownerId/members
   */
  @Get()
  findAll(@Param('ownerId', ParseIntPipe) ownerId: number) {
    return this.membersService.findAllByOwner(ownerId);
  }

  /**
   * Get a specific member
   * GET /owners/:ownerId/members/:id
   */
  @Get(':id')
  findOne(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.membersService.findOne(id, ownerId);
  }

  /**
   * Update a member
   * PATCH /owners/:ownerId/members/:id
   */
  @Patch(':id')
  update(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.membersService.update(id, ownerId, updateMemberDto);
  }

  /**
   * Delete a member
   * DELETE /owners/:ownerId/members/:id
   */
  @Delete(':id')
  remove(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.membersService.remove(id, ownerId);
  }
}