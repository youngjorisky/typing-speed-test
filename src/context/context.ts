import { createContext } from "react";
import type { Difficulty, Mode, TestState } from "../types";

export type TestContextValue = {
  difficulty: Difficulty;
  mode: Mode;
  passage: string;
  typed: string;
  elapsed: number;
  personalBest: number;
  screen: TestState;
  accuracy: number;
  correct: number;
  incorrect: number;
  wpm: number;
  setMode: (value: Mode) => void;
  setDifficulty: (value: Difficulty) => void;
  beginTest: () => void;
  restartTest: () => void;
  handleTyping: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TestContext = createContext<TestContextValue | null>(null);
