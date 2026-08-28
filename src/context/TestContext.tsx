import { useCallback, useEffect, useState } from "react";
import passages from "../../data.json";
import { TestContext } from "./context";
import type { Difficulty, Mode, TestState } from "../types";

const randomPassage = (difficulty: Difficulty) => {
  const options = passages[difficulty];
  return options[Math.floor(Math.random() * options.length)].text;
};

export function TestProvider({ children }: { children: React.ReactNode }) {
  const [difficulty, setDifficultyState] = useState<Difficulty>("hard");
  const [mode, setMode] = useState<Mode>("timed");
  const [passage, setPassage] = useState(() => randomPassage("hard"));
  const [typed, setTyped] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<TestState | null>(null);
  const [personalBest, setPersonalBest] = useState(() =>
    Number(localStorage.getItem("typing-personal-best") || 0),
  );
  const [hasCompletedTest, setHasCompletedTest] = useState(
    () => localStorage.getItem("typing-completed") === "true",
  );
  const correct = typed
    .split("")
    .filter((character, index) => character === passage[index]).length;
  const incorrect = typed.length - correct;
  const accuracy = typed.length
    ? Math.round((correct / typed.length) * 100)
    : 100;
  const wpm = elapsed ? Math.round(correct / 5 / (elapsed / 60)) : 0;
  const screen = result || (started ? "started" : "idle");

  const finishTest = useCallback(() => {
    setStarted(false);
    const finalWpm = elapsed ? Math.round(correct / 5 / (elapsed / 60)) : 0;
    const nextState: TestState = !hasCompletedTest
      ? "first-test"
      : finalWpm > personalBest
        ? "new-personal-best"
        : "results";
    if (!hasCompletedTest) {
      setHasCompletedTest(true);
      localStorage.setItem("typing-completed", "true");
    }
    if (finalWpm > personalBest) {
      setPersonalBest(finalWpm);
      localStorage.setItem("typing-personal-best", String(finalWpm));
    }
    setResult(nextState);
  }, [correct, elapsed, hasCompletedTest, personalBest]);

  useEffect(() => {
    if (!started) return;
    const timer = window.setInterval(
      () => setElapsed((value) => value + 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [started]);

  useEffect(() => {
    if (
      started &&
      ((mode === "timed" && elapsed >= 60) || typed.length >= passage.length)
    ) {
      const completion = window.setTimeout(finishTest, 0);
      return () => window.clearTimeout(completion);
    }
  }, [elapsed, typed, started, mode, passage.length, finishTest]);

  function beginTest() {
    setStarted(true);
    setResult(null);
  }

  function restartTest() {
    setPassage(randomPassage(difficulty));
    setTyped("");
    setElapsed(0);
    setStarted(false);
    setResult(null);
  }

  function handleTyping(event: React.ChangeEvent<HTMLInputElement>) {
    if (!started) beginTest();
    setTyped(event.target.value.slice(0, passage.length));
  }

  function setDifficulty(value: Difficulty) {
    setDifficultyState(value);
    if (!started && !result) setPassage(randomPassage(value));
  }

  return (
    <TestContext.Provider
      value={{
        difficulty,
        mode,
        passage,
        typed,
        elapsed,
        personalBest,
        screen,
        accuracy,
        correct,
        incorrect,
        wpm,
        setMode,
        setDifficulty,
        beginTest,
        restartTest,
        handleTyping,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}
