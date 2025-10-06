import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Query,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { HabitService } from './habit.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { CreateHabitDto } from './dto/create-habit.dto';
  import { TrackHabitDto } from './dto/track-habit.dto';
  import { Request } from 'express';
  import { User } from '../user/user.entity';
  
  @Controller('habit')
  @UseGuards(JwtAuthGuard)
  export class HabitController {
    constructor(private habitService: HabitService) {}
  
    @Post()
    async create(@Req() req: any, @Body() dto: CreateHabitDto) {
      const email = req.user.email;
      return this.habitService.createHabitByEmail(email, dto);
    }

    @Get('tracked-dates')
getTrackedDates(@Req() req: Request) {
  return this.habitService.getTrackedDates(req.user as User);
}

  
    @Get()
    get(@Req() req: Request) {
      return this.habitService.getHabit(req.user as User);
    }
  
    @Delete()
    delete(@Req() req: Request) {
      return this.habitService.deleteHabit(req.user as User);
    }
  
    @Post('track')
    track(@Req() req: Request, @Body() dto: TrackHabitDto) {
      return this.habitService.trackHabit(req.user as User, dto);
    }
  
    @Get('track/status')
    getStatus(@Req() req: Request, @Query('date') date: string) {
      const user = req.user as User;
  
      // 👇 New logic: if `?date=all`, return full list
      if (date === 'all') {
        return this.habitService.getTrackedDates(user);
      }
      
      // 👇 Otherwise, return single day status
      return this.habitService.isHabitTracked(user, date);
    }
  }
  