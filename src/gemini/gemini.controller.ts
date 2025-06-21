import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { GeminiService } from './gemini.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueryDto } from './dto/query.dto';

/**
 * Controller for handling natural language queries using Gemini AI
 * Provides endpoints to query user data using natural language
 */
@ApiTags('Gemini AI')
@Controller('gemini')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  /**
   * Process natural language query about users
   * @param queryDto - Contains the natural language question
   * @returns Query results with SQL and explanation
   */
  @Post('query')
  @ApiOperation({ 
    summary: 'Query users using natural language',
    description: 'Convert natural language questions to SQL queries and return results with explanations'
  })
  @ApiBody({ 
    type: QueryDto,
    examples: {
      userCount: {
        summary: 'Count users',
        value: { question: 'Có bao nhiêu người dùng trong hệ thống?' }
      },
      findByName: {
        summary: 'Find users by name',
        value: { question: 'Tìm người dùng có tên là Nguyễn' }
      },
      adminCount: {
        summary: 'Count admins',
        value: { question: 'Có bao nhiêu admin?' }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Query processed successfully',
    schema: {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'Original question' },
        sqlQuery: { type: 'string', description: 'Generated SQL query' },
        results: { type: 'array', description: 'Query results' },
        explanation: { type: 'string', description: 'Human-readable explanation in Vietnamese' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid query or SQL generation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async processQuery(@Body() queryDto: QueryDto) {
    try {
      const result = await this.geminiService.processQuery(queryDto.question);
      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get database schema information and sample questions
   * @returns Schema info and example questions
   */
  @Get('schema')
  @ApiOperation({ 
    summary: 'Get database schema information',
    description: 'Returns available tables, fields, and sample questions for reference'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Schema information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        tables: { type: 'array', items: { type: 'string' } },
        userFields: { type: 'array', items: { type: 'string' } },
        roleFields: { type: 'array', items: { type: 'string' } },
        sampleQuestions: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSchemaInfo() {
    const schemaInfo = await this.geminiService.getSchemaInfo();
    return {
      success: true,
      data: schemaInfo,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Health check endpoint for Gemini AI service
   * @returns Service status
   */
  @Get('health')
  @ApiOperation({ 
    summary: 'Check Gemini AI service health',
    description: 'Verify that Gemini AI service is properly configured and accessible'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        geminiConfigured: { type: 'boolean' },
        timestamp: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async healthCheck() {
    const geminiConfigured = !!process.env.GEMINI_API_KEY;
    
    return {
      status: geminiConfigured ? 'healthy' : 'configuration_missing',
      geminiConfigured,
      message: geminiConfigured 
        ? 'Gemini AI service is properly configured' 
        : 'GEMINI_API_KEY environment variable is missing',
      timestamp: new Date().toISOString()
    };
  }
}