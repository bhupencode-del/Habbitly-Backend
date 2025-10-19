import { IsNotEmpty, IsDateString } from 'class-validator';

export class TrackHabitDto {
  @IsNotEmpty({ message: 'Habit ID is required' })
  habitId: number;

  @IsDateString({}, { message: 'Date must be a valid date' })
  @IsNotEmpty({ message: 'Date is required' })
  date: string;
}
