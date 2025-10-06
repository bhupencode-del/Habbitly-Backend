import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from 'typeorm';
  import { MealLog } from '../meal-log/meal-log.entity';
  import { Habit } from '../habit/habit.entity';
  import { HabitLog } from '../habit/habit-log.entity';
  
  @Entity()
  export class User {
    // ✅ This field must exist to fix "userId not found" error
    @PrimaryGeneratedColumn()
    id: number;
  
    // ✅ Relationships
    @OneToMany(() => MealLog, (mealLog) => mealLog.user)
    mealLogs: MealLog[];
  
    @OneToMany(() => Habit, (habit) => habit.user)
    habits: Habit[];
  
    @OneToMany(() => HabitLog, (habitLog) => habitLog.user)
    habitLogs: HabitLog[];
  
    // ✅ Basic user fields
    @Column()
    name: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ unique: true })
    phoneNumber: string;
  
    @Column()
    password: string;
  
    @Column({ default: true })
    isActive: boolean;
  
    @Column({ default: 'free' })
    accessType: 'free' | 'premium';
  
    // 🧠 Questionnaire fields
    @Column({ nullable: true })
    fitnessGoal: string;
  
    @Column({ nullable: true })
    fitnessLevel: string;
  
    @Column({ nullable: true, type: 'date' })
    dateOfBirth: Date;
  
    @Column({ nullable: true })
    gender: string;
  
    @Column({ nullable: true, type: 'float' })
    height: number;
  
    @Column({ nullable: true, type: 'float' })
    weight: number;
  
    @Column({ nullable: true })
    languagesKnown: string;
  
    @Column({ nullable: true })
    city: string;
  
    @Column({ nullable: true })
    medicalConditions: string;
  
    // 🔥 Calorie & macro targets
    @Column({ type: 'int', default: 2000 })
    calorieBudget: number;
  
    @Column({ type: 'json', nullable: true })
    mealDistribution: {
      breakfast: number;
      lunch: number;
      dinner: number;
      snacks: number;
    };
  
    @Column({ type: 'json', nullable: true })
    macroDistribution: {
      protein: number;
      carbs: number;
      fats: number;
    };
  }
  