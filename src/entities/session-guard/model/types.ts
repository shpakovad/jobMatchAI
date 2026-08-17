export interface WithServerAccessProps {
  remainingAnalyses: number;
  sessionId: string;
}

export type WithServerAccessType = Partial<WithServerAccessProps>;
