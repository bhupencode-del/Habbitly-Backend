import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class SearchMealDto {
  @IsString()
  @IsNotEmpty({ message: 'Search query is required' })
  @MinLength(2, { message: 'Search query must be at least 2 characters' })
  query: string;
}
