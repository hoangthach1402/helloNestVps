import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ access_token: string; user: any }> {
    const user = await this.usersService.create(registerDto);
    
    const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role?.name || 'user' 
    };
    
    const { password, ...userWithoutPassword } = user;
    
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: any }> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role?.name || 'user' 
    };

    const { password, ...userWithoutPassword } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    
    if (user && await this.usersService.validatePassword(user, password)) {
      return user;
    }
    
    return null;
  }

  async getProfile(userId: number): Promise<User | null> {
    return await this.usersService.findOne(userId);
  }
}
