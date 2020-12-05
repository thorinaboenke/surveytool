export type User = {
  userId: number;
  username: string;
  passwordHash: string;
};

export type Session = {
  id: number;
  token: string;
  expiryTimestamp: Date;
  userId: number;
};
export type Survey = {
  surveyId: number;
  title: string;
  createdAt: string;
};

export type Result = {
  questionText: string;
  participants: number;
  averageScore: number;
};
export type Question = {
  surveyId: number;
  questionId: number;
  questionText: string;
};
export type Answer = {
  answerId: number;
  questionId: number;
  score: number;
};
