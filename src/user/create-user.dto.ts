export class CreateUserDto {
    name: string;
    email: string;
    phoneNumber: string; 
    password: string;
  
    // Questionnaire fields
    fitnessGoal?: string;
    fitnessLevel?: string;
    dateOfBirth?: Date;
    gender?: string;
    height?: number;
    weight?: number;
    languagesKnown?: string;
    city?: string;
    medicalConditions?: string;
  }
  