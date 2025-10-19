import { IsString, IsNotEmpty, IsOptional, Matches, IsDateString } from 'class-validator';

export class CreateHabitDto {
  @IsString()
  @IsNotEmpty({ message: 'Habit name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Repeat schedule is required' })
  repeat: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Reminder time must be in HH:MM format (e.g., 09:30)'
  })
  reminderTime: string;

  @IsDateString({}, { message: 'Start date must be a valid date' })
  startDate: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
