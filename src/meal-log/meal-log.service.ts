import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { MealLog } from './meal-log.entity';
import { CreateMealDto } from './dto/create-meal.dto';
import { User } from '../user/user.entity';
import { SearchMealDto } from './dto/search-meal.dto';
import axios from 'axios';
import * as dotenv from 'dotenv';


dotenv.config();

@Injectable()
export class MealLogService {
  constructor(
    @InjectRepository(MealLog)
    private mealRepo: Repository<MealLog>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  private normalizeDate(date: Date) {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  async searchFood(searchMealDto: SearchMealDto) {
    const { query } = searchMealDto;
    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) throw new Error('API Key is missing in .env file');

    const url = `https://api.spoonacular.com/food/ingredients/search?query=${query}&number=10&apiKey=${apiKey}`;

    try {
      const response = await axios.get(url);
      return response.data.results.map(food => ({
        id: food.id,
        name: food.name,
        image: food.image
          ? `https://spoonacular.com/cdn/ingredients_100x100/${food.image}`
          : null,
      }));
    } catch (error) {
      console.error('Error fetching food data:', error);
      throw new Error('Failed to fetch food data');
    }
  }

  async deleteMealLog(userId: number, mealId: number): Promise<boolean> {
    const meal = await this.mealRepo.findOne({
      where: { id: mealId, user: { id: userId } },
    });

    if (!meal) throw new Error('Meal not found or unauthorized');

    await this.mealRepo.remove(meal);
    return true;
  }

  async getNutritionSummary(date: string, mealType: string, userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
  
    const whereOptions: any = {
      user: { id: userId },
      date,
    };
  
    if (mealType !== 'today') {
      whereOptions.mealType = mealType;
    }
  
    const logs = await this.mealRepo.find({ where: whereOptions });
  
    const total = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
  
      calcium: 0,
      iron: 0,
      magnesium: 0,
      zinc: 0,
      potassium: 0,
  
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminB12: 0,
      folate: 0,
    };
  
    for (const log of logs) {
      total.calories += log.calories;
      total.protein += log.protein;
      total.carbs += log.carbs;
      total.fats += log.fats;
      total.fiber += log.fiber || 0;
  
      total.calcium += log.calcium || 0;
      total.iron += log.iron || 0;
      total.magnesium += log.magnesium || 0;
      total.zinc += log.zinc || 0;
      total.potassium += log.potassium || 0;
  
      total.vitaminA += log.vitaminA || 0;
      total.vitaminC += log.vitaminC || 0;
      total.vitaminD += log.vitaminD || 0;
      total.vitaminB12 += log.vitaminB12 || 0;
      total.folate += log.folate || 0;
    }
  
    const targetProtein = user.macroDistribution?.protein ?? 100;
    const targetCarbs = user.macroDistribution?.carbs ?? 250;
    const targetFats = user.macroDistribution?.fats ?? 70;
    const targetCalories = user.calorieBudget ?? 2000;
  
    return {
      calories: total.calories,
      macros: [
        { label: 'Protein', value: total.protein, target: targetProtein, color: '#FF7043' },
        { label: 'Carbs', value: total.carbs, target: targetCarbs, color: '#66BB6A' },
        { label: 'Fats', value: total.fats, target: targetFats, color: '#29B6F6' },
        { label: 'Fiber', value: total.fiber, target: 25, color: '#AB47BC' },
      ],
      micros: [
        { label: 'Calcium', value: total.calcium, target: 1000, unit: 'mg' },
        { label: 'Iron', value: total.iron, target: 18, unit: 'mg' },
        { label: 'Magnesium', value: total.magnesium, target: 400, unit: 'mg' },
        { label: 'Zinc', value: total.zinc, target: 11, unit: 'mg' },
        { label: 'Potassium', value: total.potassium, target: 4700, unit: 'mg' },
      ],
      vitamins: [
        { label: 'Vitamin A', value: total.vitaminA, target: 900, unit: 'mcg' },
        { label: 'Vitamin C', value: total.vitaminC, target: 90, unit: 'mg' },
        { label: 'Vitamin D', value: total.vitaminD, target: 20, unit: 'mcg' },
        { label: 'Vitamin B12', value: total.vitaminB12, target: 2.4, unit: 'mcg' },
        { label: 'Folate', value: total.folate, target: 400, unit: 'mcg' },
      ],
    };
  }
  

  async getFoodNutrition(foodId: number, quantity: number, unit: string) {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const url = `https://api.spoonacular.com/food/ingredients/${foodId}/information?amount=${quantity}&unit=${unit}&apiKey=${apiKey}`;
  
    const response = await axios.get(url);
    const food = response.data;
  
    return {
      id: food.id,
      name: food.name,
      image: food.image
        ? `https://spoonacular.com/cdn/ingredients_100x100/${food.image}`
        : null,
      unit,
      quantity,
      availableUnits: food.possibleUnits,
      nutrition: food.nutrition.nutrients
        .filter(nutrient =>
          [
            'Calories',
            'Protein',
            'Carbohydrates',
            'Fat',
            'Fiber',
            'Calcium',
            'Iron',
            'Magnesium',
            'Zinc',
            'Potassium',
            'Vitamin A',
            'Vitamin C',
            'Vitamin D',
            'Vitamin B12',
            'Folate',
          ].includes(nutrient.name)
        )
        .map(nutrient => ({
          name: nutrient.name,
          amount: nutrient.amount,
          unit: nutrient.unit,
        })),
    };
  }
  
  

  async createMealLog(userId: number, data: CreateMealDto): Promise<MealLog> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
  
    const meal = this.mealRepo.create({
      ...data,
      user,
      fiber: data.fiber || 0,
      calcium: data.calcium || 0,
      iron: data.iron || 0,
      magnesium: data.magnesium || 0,
      zinc: data.zinc || 0,
      potassium: data.potassium || 0,
      vitaminA: data.vitaminA || 0,
      vitaminC: data.vitaminC || 0,
      vitaminD: data.vitaminD || 0,
      vitaminB12: data.vitaminB12 || 0,
      folate: data.folate || 0,
    });
  
    return this.mealRepo.save(meal);
  }
  

  async getTodayMealLogs(userId: number) {
    const today = this.normalizeDate(new Date());

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const logs = await this.mealRepo.find({
      where: { user: { id: userId }, date: MoreThanOrEqual(today) },
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    logs.forEach(meal => {
      totalCalories += meal.calories;
      totalProtein += meal.protein;
      totalCarbs += meal.carbs;
      totalFats += meal.fats;
    });

    const dailyTargets = {
      calories: user.calorieBudget ?? 2000,
      protein: user.macroDistribution?.protein ?? 150,
      carbs: user.macroDistribution?.carbs ?? 250,
      fats: user.macroDistribution?.fats ?? 70,
    };

    const progressData = {
      calories: Math.min((totalCalories / dailyTargets.calories) * 100, 100),
      protein: Math.min((totalProtein / dailyTargets.protein) * 100, 100),
      carbs: Math.min((totalCarbs / dailyTargets.carbs) * 100, 100),
      fats: Math.min((totalFats / dailyTargets.fats) * 100, 100),
    };

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      progressData,
      meals: logs,
    };
  }

  async getMealProgress(userId: number) {
    const today = this.normalizeDate(new Date());

    const logs = await this.mealRepo.find({
      where: { user: { id: userId }, date: MoreThanOrEqual(today) },
    });

    return {
      totalMealsLogged: logs.length,
      totalMealsAvailable: 4,
    };
  }

  async getMealStreak(userId: number): Promise<{ streak: number }> {
    const logs = await this.mealRepo.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
    });

    const dates = new Set(logs.map(log => this.normalizeDate(log.date).toDateString()));
    let streak = 0;
    let currentDate = this.normalizeDate(new Date());

    while (dates.has(currentDate.toDateString())) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return { streak };
  }

  async getMacrosProgress(userId: number) {
    const today = this.normalizeDate(new Date());

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const logs = await this.mealRepo.find({
      where: { user: { id: userId }, date: MoreThanOrEqual(today) },
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    logs.forEach(meal => {
      totalCalories += meal.calories;
      totalProtein += meal.protein;
      totalCarbs += meal.carbs;
      totalFats += meal.fats;
    });

    const targetCalories = user.calorieBudget ?? 2000;
    const targetProtein = user.macroDistribution?.protein ?? 100;
    const targetCarbs = user.macroDistribution?.carbs ?? 250;
    const targetFats = user.macroDistribution?.fats ?? 70;

    return {
      totalCalories,
      caloriesTarget: targetCalories,
      caloriesProgress: Math.min((totalCalories / targetCalories) * 100, 100),

      totalProtein,
      proteinTarget: targetProtein,
      proteinProgress: Math.min((totalProtein / targetProtein) * 100, 100),

      totalCarbs,
      carbsTarget: targetCarbs,
      carbsProgress: Math.min((totalCarbs / targetCarbs) * 100, 100),

      totalFats,
      fatsTarget: targetFats,
      fatsProgress: Math.min((totalFats / targetFats) * 100, 100),
    };
  }
}
