// src/habit/habit.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { User } from '../user/user.entity';
  import { HabitLog } from './habit-log.entity';
  
  @Entity()
  export class Habit {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column()
    repeat: string;
  
    @Column()
    reminderTime: string;
  
    @Column()
    startDate: string;
  
    @Column({ nullable: true })
    notes: string;
  
    @ManyToOne(() => User, (user) => user.habits, { onDelete: 'CASCADE' })
    user: User;
    
    @OneToMany(() => HabitLog, (log) => log.habit, { cascade: true })
    logs: HabitLog[];
    
  }
  