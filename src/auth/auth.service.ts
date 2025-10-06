import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/create-user.dto';
import { LoginUserDto } from '../user/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UserService)) // ✅ Fix circular dependency
    private userService: UserService,
  ) {}

  async register(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // ✅ Destructure user and token properly
    const { user, token } = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
      user,
      token,
    };
  }

  async login(dto: LoginUserDto) {
    const user = await this.userService.findByEmailOrPhone(dto.email, dto.phoneNumber);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return {
      message: 'Login successful',
      user,
      token: this.generateToken(user),
    };
  }

  generateToken(user: User): { access_token: string } {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
