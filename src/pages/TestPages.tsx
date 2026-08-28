import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Animations } from "../components/Animations";
import { Controls } from "../components/Controls";
import { Passage } from "../components/Passage";
import { Results } from "../components/Results";
import { Restart } from "../components/Restart";
import { Stats } from "../components/Stats";
import { TypingPassage } from "../components/TypingPassage";
import { useTest } from "../context/useTest";
import type { TestState } from "../types";

function useStateRoute(expected: TestState) {
  const { screen } = useTest();
  const navigate = useNavigate();
  useEffect(() => {
    if (screen !== expected) navigate(`/${screen}`, { replace: true });
  }, [expected, navigate, screen]);
}

function TestControls() {
  const { difficulty, mode, setDifficulty, setMode } = useTest();
  return (
    <Controls
      difficulty={difficulty}
      mode={mode}
      setDifficulty={setDifficulty}
      setMode={setMode}
    />
  );
}

export function IdlePage() {
  useStateRoute("idle");
  const { passage, beginTest } = useTest();
  return (
    <>
      <Stats values={["0", "100%", "0:60"]} />
      <TestControls />
      <Passage text={passage} />
      <div className="start-prompt">
        <button className="start-btn" onClick={beginTest}>
          Start Typing Test
        </button>
        <p>Or click the text and start typing</p>
      </div>
    </>
  );
}

export function StartedPage() {
  useStateRoute("started");
  const {
    mode,
    elapsed,
    wpm,
    accuracy,
    passage,
    typed,
    handleTyping,
    restartTest,
  } = useTest();
  return (
    <>
      <Stats
        values={[
          String(wpm),
          `${accuracy}%`,
          formatTime(mode === "timed" ? 60 - elapsed : elapsed),
        ]}
      />
      <TestControls />
      <TypingPassage text={passage} typed={typed} onChange={handleTyping} />
      <Restart label="Restart Test" onClick={restartTest} />
    </>
  );
}

export function ResultPage({
  state,
}: {
  state: Exclude<TestState, "idle" | "started">;
}) {
  useStateRoute(state);
  const { wpm, accuracy, correct, incorrect, restartTest } = useTest();
  const isFirst = state === "first-test";
  const isBest = state === "new-personal-best";
  return (
    <>
      <Results
        title={
          isFirst
            ? "Baseline Established!"
            : isBest
              ? "High Score Smashed!"
              : "Test Complete!"
        }
        subtitle={
          isFirst
            ? "You've set the bar. Now the real challenge begins—time to beat it."
            : isBest
              ? "You're getting faster. That was incredible typing."
              : "Solid run. Keep pushing to beat your high score."
        }
        action={isFirst || isBest ? "Beat This Score" : "Go Again"}
        personalBest={isBest}
        wpm={wpm}
        accuracy={accuracy}
        correct={correct}
        incorrect={incorrect}
        onRestart={restartTest}
      />
      <Animations showConfetti={isBest} />
    </>
  );
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
