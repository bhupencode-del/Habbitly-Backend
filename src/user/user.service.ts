import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
    ConflictException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { User } from './user.entity';
  import { CreateUserDto } from './create-user.dto';
  import * as bcrypt from 'bcrypt';
  import { AuthService } from '../auth/auth.service';
  import { UpdateCalorieBudgetDto } from './dto/update-calorie-budget.dto';
  
  @Injectable()
  export class UserService {
    constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
      private authService: AuthService,
    ) {}
  
    // ✅ Save or update user's calorie budget
    async updateCalorieBudget(userId: number, dto: UpdateCalorieBudgetDto) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
  
      if (!user) throw new Error('User not found');
  
      user.calorieBudget = dto.totalCalories;
      user.mealDistribution = dto.meals;
      user.macroDistribution = dto.macros;
  
      return this.userRepository.save(user);
    }
  
    // ✅ Get user's calorie budget
    async getCalorieBudget(userId: number) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
  
      if (!user) throw new Error('User not found');
  
      return {
        totalCalories: user.calorieBudget,
        meals: user.mealDistribution,
        macros: user.macroDistribution,
      };
    }
  
    async createUser(createUserDto: CreateUserDto): Promise<{ user: User; token: { access_token: string } }> {
      const {
        name,
        email,
        phoneNumber,
        password,
        fitnessGoal,
        fitnessLevel,
        dateOfBirth,
        gender,
        height,
        weight,
        languagesKnown,
        city,
        medicalConditions,
      } = createUserDto;
  
      const existingUser = await this.userRepository.findOne({
        where: [{ email }, { phoneNumber }],
      });
  
      if (existingUser) {
        throw new ConflictException("Email or phone number already registered");
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = this.userRepository.create({
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        fitnessGoal,
        fitnessLevel,
        dateOfBirth,
        gender,
        height,
        weight,
        languagesKnown,
        city,
        medicalConditions,
      });
  
      const savedUser = await this.userRepository.save(user);
      const token = this.authService.generateToken(savedUser);
  
      return { user: savedUser, token };
    }
  
    async findByPhone(phoneNumber: string): Promise<User | null> {
      return await this.userRepository.findOne({ where: { phoneNumber } });
    }
  
    async findByEmailOrPhone(email?: string, phoneNumber?: string): Promise<User | null> {
      return this.userRepository.findOne({
        where: [
          { email: email || '' },
          { phoneNumber: phoneNumber || '' },
        ],
      });
    }
  
    async updateProfile(userId: number, updateData: Partial<User>): Promise<User> {
      const user = await this.userRepository.findOne({ where: { id: userId } });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      Object.assign(user, updateData);
      return this.userRepository.save(user);
    }
  
    async findAll(): Promise<User[]> {
      return this.userRepository.find();
    }
  
    async loginUser(email: string, phoneNumber: string, password: string): Promise<{ access_token: string }> {
      const user = await this.userRepository.findOne({
        where: email ? { email } : { phoneNumber },
      });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      return this.authService.generateToken(user);
    }
  
    async getProfile(userId: number): Promise<User> {
      const user = await this.userRepository.findOne({ where: { id: userId } });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const { password, ...safeUser } = user;
      return safeUser as User;
    }
  }
  