import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './habit.entity';
import { HabitLog } from './habit-log.entity';
import { User } from '../user/user.entity';
import { HabitService } from './habit.service';
import { HabitController } from './habit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitLog, User])],
  controllers: [HabitController],
  providers: [HabitService],
})
export class HabitModule {}