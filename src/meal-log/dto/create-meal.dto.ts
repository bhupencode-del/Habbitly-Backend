import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMealDto {
  @IsString()
  foodName: string;

  @IsNumber()
  quantity: number;

  @IsString()
  unit: string;

  @IsNumber()
  calories: number;

  @IsNumber()
  protein: number;

  @IsNumber()
  carbs: number;

  @IsNumber()
  fats: number;

  @IsOptional()
  @IsNumber()
  fiber?: number;

  @IsOptional()
  @IsNumber()
  calcium?: number;

  @IsOptional()
  @IsNumber()
  iron?: number;

  @IsOptional()
  @IsNumber()
  magnesium?: number;

  @IsOptional()
  @IsNumber()
  zinc?: number;

  @IsOptional()
  @IsNumber()
  potassium?: number;

  @IsOptional()
  @IsNumber()
  vitaminA?: number;

  @IsOptional()
  @IsNumber()
  vitaminC?: number;

  @IsOptional()
  @IsNumber()
  vitaminD?: number;

  @IsOptional()
  @IsNumber()
  vitaminB12?: number;

  @IsOptional()
  @IsNumber()
  folate?: number;

  @IsString()
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';

  @IsString()
  date: string;
}
