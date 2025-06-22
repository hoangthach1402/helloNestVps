import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }  async validate(payload: any) {
    console.log('🔍 JWT payload received:', payload);
    const userId = Number(payload.sub);
    const user = await this.authService.getProfile(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    
    const userInfo = { 
      sub: Number(payload.sub), // Giữ sub như trong token gốc
      userId: Number(payload.sub), 
      username: String(payload.username), 
      role: String(payload.role) 
    };
    console.log('✅ User validated:', userInfo);
    return userInfo;
  }
}
