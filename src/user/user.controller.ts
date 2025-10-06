import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Request,
    BadRequestException,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto } from './create-user.dto';
  import { LoginUserDto } from './login-user.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { UpdateCalorieBudgetDto } from './dto/update-calorie-budget.dto';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    // ✅ Register new user
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
      return this.userService.createUser(createUserDto);
    }
  
    // ✅ Login with email or phoneNumber + password
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
      if (!loginUserDto) {
        throw new BadRequestException('Missing login data');
      }
  
      const { email, phoneNumber, password } = loginUserDto;
  
      if (!email && !phoneNumber) {
        throw new BadRequestException('Either email or phone number is required');
      }
  
      return this.userService.loginUser(email ?? '', phoneNumber ?? '', password);
    }
  
    // ✅ Check if phone number already exists
    @Post('check-phone')
    async checkPhone(@Body('phoneNumber') phoneNumber: string) {
      const user = await this.userService.findByPhone(phoneNumber);
      return { exists: !!user };
    }
  
    // ✅ Update Profile after login (JWT Protected)
    @UseGuards(JwtAuthGuard)
    @Post('update-profile')
    async updateProfile(@Request() req, @Body() body) {
      return this.userService.updateProfile(req.user.userId, body);
    }
  
    // ✅ Get all users
    @Get('all')
    async getAllUsers() {
      return this.userService.findAll();
    }
  
    // ✅ Get logged-in user profile (JWT Protected)
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
      return this.userService.getProfile(req.user.userId);
    }
  
    // ✅ Save user's calorie budget (JWT Protected)
    @UseGuards(JwtAuthGuard)
    @Post('calorie-budget')
    async updateCalorieBudget(@Request() req, @Body() body: UpdateCalorieBudgetDto) {
      return this.userService.updateCalorieBudget(req.user.userId, body);
    }
  
    // ✅ Get user's calorie budget (JWT Protected)
    @UseGuards(JwtAuthGuard)
    @Get('calorie-budget')
    async getCalorieBudget(@Request() req) {
      return this.userService.getCalorieBudget(req.user.userId);
    }
  }
  