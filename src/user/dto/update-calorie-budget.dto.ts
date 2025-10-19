import { IsNumber, IsPositive, IsNotEmpty, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class MealsDto {
  @IsNumber({}, { message: 'Breakfast calories must be a number' })
  @IsPositive({ message: 'Breakfast calories must be positive' })
  breakfast: number;

  @IsNumber({}, { message: 'Lunch calories must be a number' })
  @IsPositive({ message: 'Lunch calories must be positive' })
  lunch: number;

  @IsNumber({}, { message: 'Dinner calories must be a number' })
  @IsPositive({ message: 'Dinner calories must be positive' })
  dinner: number;

  @IsNumber({}, { message: 'Snacks calories must be a number' })
  @IsPositive({ message: 'Snacks calories must be positive' })
  snacks: number;
}

class MacrosDto {
  @IsNumber({}, { message: 'Protein must be a number' })
  @IsPositive({ message: 'Protein must be positive' })
  protein: number;

  @IsNumber({}, { message: 'Carbs must be a number' })
  @IsPositive({ message: 'Carbs must be positive' })
  carbs: number;

  @IsNumber({}, { message: 'Fats must be a number' })
  @IsPositive({ message: 'Fats must be positive' })
  fats: number;
}

export class UpdateCalorieBudgetDto {
  @IsNumber({}, { message: 'Total calories must be a number' })
  @IsPositive({ message: 'Total calories must be positive' })
  @IsNotEmpty({ message: 'Total calories is required' })
  totalCalories: number;

  @ValidateNested()
  @Type(() => MealsDto)
  @IsObject()
  @IsNotEmpty({ message: 'Meals breakdown is required' })
  meals: MealsDto;

  @ValidateNested()
  @Type(() => MacrosDto)
  @IsObject()
  @IsNotEmpty({ message: 'Macros breakdown is required' })
  macros: MacrosDto;
}

  