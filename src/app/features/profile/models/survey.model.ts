export interface SurveyOption {
  id: string;
  label: string;
}

export interface SurveyScale {
  min: number;
  max: number;
}

export type SurveyQuestionType =
  | 'single_select'
  | 'multi_select'
  | 'scale_matrix'
  | 'multi_text'
  | 'rate_movies';

export interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  question: string | null;
  options?: SurveyOption[];
  rows?: string[];
  scale?: SurveyScale;
  max?: number | null;
  minRequired?: number | null;
  moviePool?: string | null;
  required: boolean;
}

export interface Survey {
  version: number;
  questions: SurveyQuestion[];
}

export type SurveyAnswers = Record<string, unknown>;

export interface SubmitSurveyPayload {
  version: number;
  answers: SurveyAnswers;
}

export interface SurveyResponse {
  version: number;
  completedAt: string;
  answers: SurveyAnswers;
}
