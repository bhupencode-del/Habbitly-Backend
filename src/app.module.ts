import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MealLogModule } from './meal-log/meal-log.module';
import { HabitModule } from './habit/habit.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'achilles',  // Your Mac username as DB user
      password: '9809@Bhupen', // Password you set
      database: 'habbitly_db', // Your database name
      autoLoadEntities: true, // Automatically load entities (tables)
      synchronize: true, // Auto-create tables (development only)
    }),
    UserModule,
    AuthModule,
    MealLogModule,
    HabitModule,
  ],
})
export class AppModule {}
