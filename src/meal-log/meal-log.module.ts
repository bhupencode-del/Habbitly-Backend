// src/meal-log/meal-log.module.ts
import { Module } from '@nestjs/common';
import { MealLogService } from './meal-log.service';
import { MealLogController } from './meal-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealLog } from './meal-log.entity';
import { User } from '../user/user.entity'; // to enable @ManyToOne
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MealLog, User]),
    AuthModule,
  ],
  controllers: [MealLogController],
  providers: [MealLogService],
})
export class MealLogModule {}
