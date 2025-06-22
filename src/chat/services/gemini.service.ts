import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    @InjectDataSource() private dataSource: DataSource
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }
  async askSQL(
    userQuestion: string,
    chatHistory: string = ''
  ): Promise<{ answer: string; sqlQuery: string; data: any }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });      const databaseSchema = `
# DATABASE SCHEMA
## Bảng users:
- id: SERIAL PRIMARY KEY
- username: VARCHAR(100) UNIQUE
- email: VARCHAR(255) UNIQUE  
- password: VARCHAR(255)
- "firstName": VARCHAR(100) (chú ý: camelCase, cần dùng quotes)
- "lastName": VARCHAR(100) (chú ý: camelCase, cần dùng quotes)
- "isActive": BOOLEAN DEFAULT true (chú ý: camelCase, cần dùng quotes)
- "createdAt": TIMESTAMP DEFAULT CURRENT_TIMESTAMP (chú ý: camelCase, cần dùng quotes)
- "roleId": INTEGER DEFAULT 1 (chú ý: camelCase, cần dùng quotes)

## Bảng roles:
- id: SERIAL PRIMARY KEY
- name: VARCHAR(50) UNIQUE
- description: TEXT

## Bảng chats:
- id: UUID PRIMARY KEY
- session_id: VARCHAR(255)
- message: TEXT
- role: VARCHAR(10) (user/assistant)
- sql_query: TEXT
- data: JSON
- created_at: TIMESTAMP

LƯU Ý QUAN TRỌNG: 
- PostgreSQL phân biệt chữ hoa/thường
- Các column có camelCase phải được bao quanh bởi dấu ngoặc kép
- VD: SELECT id, username, "firstName", "lastName", "isActive" FROM users
`;      const prompt = `
Bạn là chuyên gia SQL và Database PostgreSQL. Nhiệm vụ:
1. Phân tích câu hỏi của user
2. Tạo câu SQL phù hợp với PostgreSQL syntax
3. Trả lời bằng tiếng Việt

DATABASE HIỆN TẠI (PostgreSQL):
${databaseSchema}

${chatHistory ? `LỊCH SỬ CHAT:\n${chatHistory}\n` : ''}

CÂU HỎI: ${userQuestion}

QUAN TRỌNG - PostgreSQL Rules:
- Column names có camelCase PHẢI dùng dấu ngoặc kép: "firstName", "lastName", "isActive", "createdAt"
- Column names thường (username, email, password) KHÔNG cần ngoặc kép
- VD đúng: SELECT id, username, "firstName", "lastName" FROM users
- VD sai: SELECT id, username, first_name, last_name FROM users

Trả về JSON format:
{
  "answer": "Giải thích bằng tiếng Việt",
  "sqlQuery": "SELECT id, username, \"firstName\" FROM users...",
  "data": null
}

Chỉ tạo SQL an toàn (SELECT queries only).
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();      // Parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const sqlQuery = parsed.sqlQuery || '';
            // Thực thi SQL query nếu có
          let data: any = null;
          if (sqlQuery && this.isSafeQuery(sqlQuery)) {
            try {
              data = await this.dataSource.query(sqlQuery);
            } catch (sqlError) {
              console.error('SQL execution error:', sqlError);
              data = { error: 'Không thể thực thi SQL query', details: sqlError.message };
            }
          }
          
          return {
            answer: parsed.answer || 'Đã tạo SQL query',
            sqlQuery,
            data
          };
        }
      } catch (parseError) {
        console.warn('JSON parse failed, extracting SQL manually');
      }      // Fallback: extract SQL manually
      const sqlQuery = this.extractSQL(text);
      let data: any = null;
      
      if (sqlQuery && this.isSafeQuery(sqlQuery)) {
        try {
          data = await this.dataSource.query(sqlQuery);
        } catch (sqlError) {
          console.error('SQL execution error:', sqlError);
          data = { error: 'Không thể thực thi SQL query', details: sqlError.message };
        }
      }
      
      return {
        answer: text,
        sqlQuery,
        data
      };

    } catch (error) {
      console.error('Gemini API error:', error);
      throw new BadRequestException(`Lỗi AI: ${error.message}`);
    }
  }
  async generateVocabularyResponse(message: string, userId: number): Promise<any> {
    try {
      // 1. Lấy cấu trúc bảng vocabulary từ database
      const tableStructure = await this.dataSource.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'vocabularies'
        ORDER BY ordinal_position
      `);
      
      // 2. Lấy từ vựng của user
      const vocabularyData = await this.dataSource.query(`
        SELECT * FROM vocabularies 
        WHERE "userId" = $1 
        ORDER BY "nextReviewDate" ASC, status ASC
        LIMIT 50
      `, [userId]);
      
      // 3. Lấy thống kê để tạo context
      const stats = await this.dataSource.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 0) as new_words,
          COUNT(*) FILTER (WHERE status = 1) as learning,
          COUNT(*) FILTER (WHERE status = 2) as reviewing,
          COUNT(*) FILTER (WHERE status = 3) as mastered,
          COUNT(*) FILTER (WHERE "nextReviewDate" <= CURRENT_DATE) as due_today
        FROM vocabularies 
        WHERE "userId" = $1
      `, [userId]);
      
      // 4. Tạo context cho Gemini
      const contextPrompt = `
        # VOCABULARY LEARNING ASSISTANT 📚
        
        ## DATABASE STRUCTURE:
        Table: vocabularies
        ${tableStructure.map(col => `- ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`).join('\n')}
        
        ## USER STATISTICS:
        - Tổng từ vựng: ${stats[0]?.total || 0}
        - Từ mới: ${stats[0]?.new_words || 0}
        - Đang học: ${stats[0]?.learning || 0}
        - Đang ôn tập: ${stats[0]?.reviewing || 0}
        - Đã thuộc: ${stats[0]?.mastered || 0}
        - Cần ôn hôm nay: ${stats[0]?.due_today || 0}
        
        ## VOCABULARY LIST:
        ${vocabularyData.length > 0 ? vocabularyData.map((v, i) => `
        ${i+1}. **${v.word}** 
           - Nghĩa: ${v.meaning}
           - Ví dụ: ${v.example || 'Chưa có'}
           - Phân loại: ${v.category || 'Chưa phân loại'}
           - Cấp độ: ${v.level || 'Chưa xác định'}
           - Trạng thái: ${this.getStatusText(v.status)}
           - Ngày ôn tập tiếp: ${new Date(v.nextReviewDate).toLocaleDateString('vi-VN')}
           - ID: ${v.id}
        `).join('\n') : 'Chưa có từ vựng nào.'}
        
        ## NHIỆM VỤ CỦA BẠN:
        1. **Phân tích yêu cầu** của người dùng
        2. **Tạo bài tập phù hợp** dựa trên từ vựng hiện có
        3. **Đưa ra gợi ý học tập** thông minh
        4. **Tạo câu hỏi kiểm tra** kiến thức
        5. **Hướng dẫn cập nhật** trạng thái học tập
        
        ## CÁC LOẠI BÀI TẬP CÓ THỂ TẠO:
        - **Trắc nghiệm**: Chọn nghĩa đúng của từ
        - **Điền từ**: Điền vào chỗ trống trong câu
        - **Ghép đôi**: Ghép từ với nghĩa
        - **Tạo câu**: Dùng từ để tạo câu mới
        - **Phân loại**: Sắp xếp từ theo chủ đề
        
        ## HƯỚNG DẪN API:
        - Thêm từ mới: POST /vocabulary
        - Cập nhật trạng thái: PUT /vocabulary/:id/review
        - Xem từ cần ôn: GET /vocabulary/due-today
        
        ## YÊU CẦU CỦA NGƯỜI DÙNG:
        "${message}"
        
        Hãy trả lời bằng tiếng Việt, thân thiện và hữu ích. Nếu tạo bài tập, hãy đưa ra đáp án sau khi người dùng trả lời.
      `;
      
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        message: text.trim(),
        userStats: stats[0],
        vocabularyCount: vocabularyData.length,
        dueToday: stats[0]?.due_today || 0,
        recentWords: vocabularyData.slice(0, 5) // 5 từ gần nhất để preview
      };
    } catch (error) {
      console.error('Gemini Vocabulary error:', error);
      return {
        message: "Xin lỗi, tôi không thể xử lý yêu cầu về từ vựng lúc này. Vui lòng thử lại sau.",
        error: error.message
      };
    }
  }

  private getStatusText(status: number): string {
    switch(status) {
      case 0: return "Từ mới 🆕";
      case 1: return "Đang học 📚"; 
      case 2: return "Đang ôn tập 🔄";
      case 3: return "Đã thuộc ✅";
      default: return "Không xác định ❓";
    }
  }

  private extractSQL(text: string): string {
    const patterns = [
      /```sql\s*([\s\S]*?)\s*```/i,
      /```\s*(SELECT[\s\S]*?);/i,
      /(SELECT[\s\S]*?;)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return '';
  }

  private isSafeQuery(sql: string): boolean {
    const query = sql.trim().toLowerCase();
    
    // Chỉ cho phép SELECT queries
    if (!query.startsWith('select')) {
      return false;
    }
    
    // Không cho phép các từ khóa nguy hiểm
    const dangerousKeywords = [
      'drop', 'delete', 'update', 'insert', 'create', 'alter', 
      'truncate', 'exec', 'execute', 'sp_', 'xp_'
    ];
    
    for (const keyword of dangerousKeywords) {
      if (query.includes(keyword)) {
        return false;
      }
    }
    
    return true;
  }
}
