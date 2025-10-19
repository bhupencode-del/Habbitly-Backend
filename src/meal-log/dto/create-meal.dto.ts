import { IsNumber, IsOptional, IsString, IsNotEmpty, IsPositive, IsIn, IsDateString, Min } from 'class-validator';

export class CreateMealDto {
  @IsString()
  @IsNotEmpty({ message: 'Food name is required' })
  foodName: string;

  @IsNumber()
  @IsPositive({ message: 'Quantity must be a positive number' })
  @IsNotEmpty({ message: 'Quantity is required' })
  quantity: number;

  @IsString()
  @IsNotEmpty({ message: 'Unit is required' })
  unit: string;

  @IsNumber()
  @Min(0, { message: 'Calories cannot be negative' })
  @IsNotEmpty({ message: 'Calories is required' })
  calories: number;

  @IsNumber()
  @Min(0, { message: 'Protein cannot be negative' })
  @IsNotEmpty({ message: 'Protein is required' })
  protein: number;

  @IsNumber()
  @Min(0, { message: 'Carbs cannot be negative' })
  @IsNotEmpty({ message: 'Carbs is required' })
  carbs: number;

  @IsNumber()
  @Min(0, { message: 'Fats cannot be negative' })
  @IsNotEmpty({ message: 'Fats is required' })
  fats: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Fiber cannot be negative' })
  fiber?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Calcium cannot be negative' })
  calcium?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Iron cannot be negative' })
  iron?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Magnesium cannot be negative' })
  magnesium?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Zinc cannot be negative' })
  zinc?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Potassium cannot be negative' })
  potassium?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Vitamin A cannot be negative' })
  vitaminA?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Vitamin C cannot be negative' })
  vitaminC?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Vitamin D cannot be negative' })
  vitaminD?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Vitamin B12 cannot be negative' })
  vitaminB12?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Folate cannot be negative' })
  folate?: number;

  @IsString()
  @IsIn(['breakfast', 'lunch', 'dinner', 'snacks'], {
    message: 'Meal type must be one of: breakfast, lunch, dinner, snacks'
  })
  @IsNotEmpty({ message: 'Meal type is required' })
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';

  @IsDateString({}, { message: 'Date must be a valid date string' })
  @IsNotEmpty({ message: 'Date is required' })
  date: string;
}
