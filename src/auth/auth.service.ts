import { UserService } from 'src/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneWithUsername(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      username: user.username,
      firstName: user.firstName,  
      lastName: user.lastName,     
      role:user.role,
    };    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
