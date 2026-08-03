export interface IAnalyzeResponse {
  vacancyName: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}
