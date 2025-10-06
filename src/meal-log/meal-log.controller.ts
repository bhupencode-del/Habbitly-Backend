import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    Query,
    HttpCode,
    BadRequestException,
    Delete,
    Param,
  } from '@nestjs/common';
  import { MealLogService } from './meal-log.service';
  import { CreateMealDto } from './dto/create-meal.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @Controller('meal-log')
  export class MealLogController {
    constructor(private readonly mealLogService: MealLogService) {}
  
    // ✅ Create a meal log (JWT Protected)
    @UseGuards(JwtAuthGuard)
    @Post()
    async createMeal(@Request() req, @Body() body: CreateMealDto) {
      if (!body.foodName || !body.quantity || !body.unit) {
        throw new BadRequestException('Food name, quantity, and unit are required');
      }
      return this.mealLogService.createMealLog(req.user.userId, body);
    }
  
    // ✅ Fetch nutrition summary
    @UseGuards(JwtAuthGuard)
    @Get('/nutrition-summary')
    async getNutritionSummary(
      @Query('date') date: string,
      @Query('mealType') mealType: string,
      @Request() req
    ) {
      return this.mealLogService.getNutritionSummary(date, mealType, req.user.userId);
    }
  
    // ✅ Search food (public)
    @Post('search-food')
    async searchFood(@Body() body: { query: string }) {
      if (!body.query) {
        throw new BadRequestException('Query parameter is required');
      }
      return this.mealLogService.searchFood(body);
    }
  
    // ✅ Get food nutrition (public)
    @Get('nutrition')
    async getFoodNutrition(
      @Query('foodId') foodId: number,
      @Query('quantity') quantity: number,
      @Query('unit') unit: string,
    ) {
      if (!foodId || !quantity || !unit) {
        throw new BadRequestException('foodId, quantity, and unit are required');
      }
      return this.mealLogService.getFoodNutrition(foodId, quantity, unit);
    }
  
    // ✅ Get today's meals
    @UseGuards(JwtAuthGuard)
    @Get('today')
    @HttpCode(200)
    async getTodayMeals(@Request() req) {
      return this.mealLogService.getTodayMealLogs(req.user.userId);
    }
  
    // ✅ Macros progress
    @UseGuards(JwtAuthGuard)
    @Get('macros-progress')
    async getMacrosProgress(@Request() req) {
      return this.mealLogService.getMacrosProgress(req.user.userId);
    }
  
    // ✅ Meal progress
    @UseGuards(JwtAuthGuard)
    @Get('progress')
    async getMealProgress(@Request() req) {
      return this.mealLogService.getMealProgress(req.user.userId);
    }
  
    // ✅ Streak
    @UseGuards(JwtAuthGuard)
    @Get('streak')
    async getMealStreak(@Request() req) {
      return this.mealLogService.getMealStreak(req.user.userId);
    }
  
    // ✅ Delete a meal
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteMeal(@Request() req, @Param('id') id: number) {
      return this.mealLogService.deleteMealLog(req.user.userId, id);
    }
  }
  