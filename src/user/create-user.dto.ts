import { IsString, IsEmail, IsNotEmpty, MinLength, Matches, IsOptional, IsNumber, IsDateString, IsIn } from 'class-validator';

export class CreateUserDto {
  // Required fields
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be exactly 10 digits'
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  // Optional questionnaire fields
  @IsString()
  @IsOptional()
  fitnessGoal?: string;

  @IsString()
  @IsOptional()
  fitnessLevel?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  @IsIn(['male', 'female', 'other'], { message: 'Gender must be male, female, or other' })
  gender?: string;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  languagesKnown?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  medicalConditions?: string;
}
