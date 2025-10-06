export class UpdateCalorieBudgetDto {
    totalCalories: number;
    meals: {
      breakfast: number;
      lunch: number;
      dinner: number;
      snacks: number;
    };
    macros: {
      protein: number;
      carbs: number;
      fats: number;
    };
  }
  