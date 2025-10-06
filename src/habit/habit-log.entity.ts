// src/habit/habit-log.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { Habit } from './habit.entity';
  import { User } from '../user/user.entity';
  
  @Entity()
  export class HabitLog {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    date: string;

    @ManyToOne(() => Habit, (habit) => habit.logs, { onDelete: 'CASCADE' })
    habit: Habit;
  
    @ManyToOne(() => User, (user) => user.habitLogs, { onDelete: 'CASCADE' })
    user: User;

  }