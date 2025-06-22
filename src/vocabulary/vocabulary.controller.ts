import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VocabularyService } from './vocabulary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVocabularyDto, UpdateVocabularyDto, UpdateReviewStatusDto, VocabularyResponseDto } from './dto/vocabulary.dto';

@ApiTags('Vocabulary 📚')
@Controller('vocabulary')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}  @Post()
  @ApiOperation({ summary: 'Thêm từ mới ➕' })
  @ApiResponse({ status: 201, description: 'Thêm từ thành công', type: VocabularyResponseDto })
  async create(@Body() dto: CreateVocabularyDto, @Request() req) {
    console.log('🔐 Headers received:', req.headers.authorization);
    console.log('👤 User from token:', req.user);
    const userId = req.user.sub || req.user.userId; // Fallback cho cả 2 trường hợp
    console.log('📝 Using userId:', userId);
    return this.vocabularyService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách từ vựng 📖' })
  @ApiResponse({ status: 200, description: 'Danh sách từ vựng', type: [VocabularyResponseDto] })
  async findAll(
    @Request() req,
    @Query('status') status?: number,
    @Query('category') category?: string,
    @Query('dueToday') dueToday?: boolean
  ) {
    const userId = req.user.sub; // Lấy userId từ JWT token
    return this.vocabularyService.findAll(userId, status, category, dueToday);
  }

  @Get('due-today')
  @ApiOperation({ summary: 'Lấy từ vựng cần ôn tập hôm nay 📅' })
  @ApiResponse({ status: 200, description: 'Từ vựng cần ôn tập hôm nay', type: [VocabularyResponseDto] })
  async getDueToday(@Request() req) {
    const userId = req.user.sub; // Lấy userId từ JWT token
    return this.vocabularyService.getDueToday(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết từ vựng 🔍' })
  @ApiResponse({ status: 200, description: 'Chi tiết từ vựng', type: VocabularyResponseDto })
  async findOne(@Param('id') id: number) {
    return this.vocabularyService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật từ vựng ✏️' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: VocabularyResponseDto })
  async update(@Param('id') id: number, @Body() dto: UpdateVocabularyDto) {
    return this.vocabularyService.update(id, dto);
  }

  @Put(':id/review')
  @ApiOperation({ summary: 'Cập nhật trạng thái ôn tập 🎯' })
  @ApiResponse({ status: 200, description: 'Cập nhật trạng thái thành công', type: VocabularyResponseDto })
  async updateReviewStatus(
    @Param('id') id: number, 
    @Body() dto: UpdateReviewStatusDto
  ) {
    return this.vocabularyService.updateReviewStatus(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa từ vựng 🗑️' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  async remove(@Param('id') id: number) {
    await this.vocabularyService.remove(id);
    return { message: 'Đã xóa từ vựng thành công' };
  }
}
