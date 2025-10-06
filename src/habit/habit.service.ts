
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './habit.entity';
import { HabitLog } from './habit-log.entity';
import { User } from '../user/user.entity';
import { CreateHabitDto } from './dto/create-habit.dto';
import { TrackHabitDto } from './dto/track-habit.dto';

@Injectable()
export class HabitService {
  constructor(
    @InjectRepository(Habit)
    private habitRepo: Repository<Habit>,

    @InjectRepository(HabitLog)
    private habitLogRepo: Repository<HabitLog>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createHabitByEmail(email: string, dto: CreateHabitDto) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const existing = await this.habitRepo.findOne({ where: { user: { id: user.id } } });
    if (existing) {
      await this.habitRepo.delete(existing.id);
    }

    const habit = this.habitRepo.create({ ...dto, user });
    return this.habitRepo.save(habit);
  }

  async getHabit(user: User) {
    return this.habitRepo.findOne({ where: { user: { id: user.id } } });
  }

  async deleteHabit(user: User) {
    const habit = await this.habitRepo.findOne({ where: { user: { id: user.id } } });
    if (!habit) return;
    await this.habitRepo.delete(habit.id);
  }

  async trackHabit(user: User, dto: TrackHabitDto) {
    const habit = await this.habitRepo.findOne({ where: { user: { id: user.id } } });
    if (!habit) throw new Error('No habit found');

    const existing = await this.habitLogRepo.findOne({
      where: { user: { id: user.id }, habit: { id: habit.id }, date: dto.date },
    });

    if (!existing) {
      const log = this.habitLogRepo.create({ date: dto.date, habit, user });
      await this.habitLogRepo.save(log);
    }

    const logs = await this.habitLogRepo.find({
      where: { user: { id: user.id }, habit: { id: habit.id } },
      select: ['date'],
    });

    return logs.map((log) => log.date);
  }

  async isHabitTracked(user: User, date: string) {
    const habit = await this.habitRepo.findOne({ where: { user: { id: user.id } } });
    if (!habit) return false;

    const existing = await this.habitLogRepo.findOne({
      where: { user: { id: user.id }, habit: { id: habit.id }, date },
    });

    return !!existing;
  }

  async getTrackedDates(user: User): Promise<string[]> {
    const habit = await this.habitRepo.findOne({ where: { user: { id: user.id } } });
    if (!habit) return [];

    const logs = await this.habitLogRepo.find({
      where: { user: { id: user.id }, habit: { id: habit.id } },
      select: ['date'],
    });

    return logs.map((log) => log.date);
  }
}
