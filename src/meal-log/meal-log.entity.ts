// src/meal-log/meal-log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class MealLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  foodName: string;

  @Column()
  quantity: number; // in grams or servings

  @Column()
  unit: string; // e.g., gram, cup, piece

  @Column('float')
  calories: number;

  @Column('float')
  protein: number;

  @Column('float')
  carbs: number;

  @Column('float')
  fats: number;

  @Column({ type: 'float', nullable: true })
  fiber: number;
  
  @Column({ type: 'float', nullable: true })
  calcium: number;
  
  @Column({ type: 'float', nullable: true })
  iron: number;
  
  @Column({ type: 'float', nullable: true })
  magnesium: number;
  
  @Column({ type: 'float', nullable: true })
  zinc: number;
  
  @Column({ type: 'float', nullable: true })
  potassium: number;
  
  @Column({ type: 'float', nullable: true })
  vitaminA: number;
  
  @Column({ type: 'float', nullable: true })
  vitaminC: number;
  
  @Column({ type: 'float', nullable: true })
  vitaminD: number;
  
  @Column({ type: 'float', nullable: true })
  vitaminB12: number;
  
  @Column({ type: 'float', nullable: true })
  folate: number;
  


  @Column()
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => User, user => user.mealLogs)
  user: User;
}
