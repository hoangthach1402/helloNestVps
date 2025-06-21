import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';

/**
 * Service to handle natural language queries using Gemini AI
 * Converts user questions to SQL queries and executes them
 */
@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    // Initialize Gemini AI with API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  /**
   * Process natural language query and return database results
   * @param question - Natural language question about users
   * @returns Query results with explanation
   */
  async processQuery(question: string): Promise<{
    question: string;
    sqlQuery: string;
    results: any[];
    explanation: string;
  }> {
    try {
      // Generate SQL query from natural language
      const sqlQuery = await this.generateSQLQuery(question);
      
      // Execute the generated query
      const results = await this.executeQuery(sqlQuery);
      
      // Generate explanation of the results
      const explanation = await this.generateExplanation(question, results);
      
      return {
        question,
        sqlQuery,
        results,
        explanation
      };
    } catch (error) {
      throw new Error(`Failed to process query: ${error.message}`);
    }
  }

  /**
   * Generate SQL query from natural language using Gemini AI
   * @param question - Natural language question
   * @returns SQL query string
   */
  private async generateSQLQuery(question: string): Promise<string> {
    const prompt = `
You are a SQL expert. Convert the following natural language question to a SQL query.

Database Schema:
- Table: users
  Columns: id (number), username (string), email (string), firstName (string), lastName (string), isActive (boolean), createdAt (timestamp), roleId (number)
- Table: roles
  Columns: id (number), name (string), description (string)

Relationships:
- users.roleId references roles.id

Question: "${question}"

Rules:
1. Return ONLY the SQL query, no explanations
2. Use PostgreSQL syntax
3. Always include proper JOINs when needed
4. Limit results to 100 rows maximum
5. For user names, search in both firstName and lastName
6. Always exclude password field from SELECT

SQL Query:`;

    const result = await this.model.generateContent(prompt);
    const response = result.response;
    let sqlQuery = response.text().trim();
    
    // Clean up the response - remove markdown formatting if present
    sqlQuery = sqlQuery.replace(/```sql\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Validate that it's a SELECT query for security
    if (!sqlQuery.toLowerCase().startsWith('select')) {
      throw new Error('Only SELECT queries are allowed');
    }
    
    return sqlQuery;
  }

  /**
   * Execute SQL query safely
   * @param sqlQuery - SQL query to execute
   * @returns Query results
   */
  private async executeQuery(sqlQuery: string): Promise<any[]> {
    try {
      // Use TypeORM's query runner for safe execution
      const results = await this.userRepository.query(sqlQuery);
      return results;
    } catch (error) {
      throw new Error(`SQL execution failed: ${error.message}`);
    }
  }

  /**
   * Generate human-readable explanation of query results
   * @param question - Original question
   * @param results - Query results
   * @returns Explanation string
   */
  private async generateExplanation(question: string, results: any[]): Promise<string> {
    const prompt = `
Generate a clear, concise explanation in Vietnamese for the following query results.

Original Question: "${question}"
Results Count: ${results.length}
Sample Data: ${JSON.stringify(results.slice(0, 3), null, 2)}

Provide a summary that:
1. Answers the original question directly
2. Mentions the number of results found
3. Highlights key insights from the data
4. Uses friendly, conversational Vietnamese

Explanation:`;

    const result = await this.model.generateContent(prompt);
    return result.response.text().trim();
  }

  /**
   * Get database schema information for reference
   * @returns Schema information
   */
  async getSchemaInfo(): Promise<{
    tables: string[];
    userFields: string[];
    roleFields: string[];
    sampleQuestions: string[];
  }> {
    return {
      tables: ['users', 'roles'],
      userFields: ['id', 'username', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'roleId'],
      roleFields: ['id', 'name', 'description'],
      sampleQuestions: [
        'Có bao nhiêu người dùng trong hệ thống?',
        'Liệt kê tất cả người dùng có tên là Nguyễn',
        'Người dùng nào được tạo trong tuần này?',
        'Có bao nhiêu admin trong hệ thống?',
        'Tìm người dùng có email chứa gmail',
        'Người dùng nào đang không hoạt động?'
      ]
    };
  }
}