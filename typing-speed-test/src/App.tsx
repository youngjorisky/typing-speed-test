import { useCallback, useEffect, useState } from "react";
import "./App.css";
import passages from "../../data.json";
import logoLarge from "./assets/logo-large.svg";
import trophyFullImage from "./assets/trophy-solid-full.svg";
import restartIcon from "./assets/icon-restart.svg";
import completedIcon from "./assets/icon-completed.svg";
import newPersonalBestIcon from "./assets/icon-new-pb.svg";
import confettiPattern from "./assets/pattern-confetti.svg";
import starPattern1 from "./assets/pattern-star-1.svg";
import starPattern2 from "./assets/pattern-star-2.svg";

type Difficulty = "easy" | "medium" | "hard";
type Mode = "timed" | "passage";
type TestState =
  | "idle"
  | "started"
  | "results"
  | "first-test"
  | "new-personal-best";

const randomPassage = (difficulty: Difficulty) => {
  const options = passages[difficulty];
  return options[Math.floor(Math.random() * options.length)].text;
};

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>("hard");
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

  function handleDifficultyChange(value: Difficulty) {
    setDifficulty(value);
    if (!started && !result) {
      setPassage(randomPassage(value));
    }
  }

  return (
    <div className={`typing-speed-container typing-speed-${screen}`}>
      <Header personalBest={personalBest} />
      <section className={`design design-${screen}`}>
        {screen === "idle" && (
          <>
            <Stats values={["0", "100%", "0:60"]} />
            <Controls
              difficulty={difficulty}
              mode={mode}
              setDifficulty={handleDifficultyChange}
              setMode={setMode}
            />
            <Passage text={passage} />
            <div className="start-prompt">
              <button className="start-btn" onClick={beginTest}>
                Start Typing Test
              </button>
              <p>Or click the text and start typing</p>
            </div>
          </>
        )}
        {screen === "started" && (
          <>
            <Stats
              values={[
                String(wpm),
                `${accuracy}%`,
                formatTime(mode === "timed" ? 60 - elapsed : elapsed),
              ]}
            />
            <Controls
              difficulty={difficulty}
              mode={mode}
              setDifficulty={handleDifficultyChange}
              setMode={setMode}
            />
            <TypingPassage
              text={passage}
              typed={typed}
              onChange={handleTyping}
            />
            <Restart label="Restart Test" onClick={restartTest} />
          </>
        )}
        {(screen === "results" ||
          screen === "first-test" ||
          screen === "new-personal-best") && (
          <>
            <Results
              title={
                screen === "first-test"
                  ? "Baseline Established!"
                  : screen === "new-personal-best"
                    ? "High Score Smashed!"
                    : "Test Complete!"
              }
              subtitle={
                screen === "first-test"
                  ? "You've set the bar. Now the real challenge begins—time to beat it."
                  : screen === "new-personal-best"
                    ? "You're getting faster. That was incredible typing."
                    : "Solid run. Keep pushing to beat your high score."
              }
              action={screen === "results" ? "Go Again" : "Beat This Score"}
              personalBest={screen === "new-personal-best"}
              wpm={wpm}
              accuracy={accuracy}
              correct={correct}
              incorrect={incorrect}
              onRestart={restartTest}
            />
            <Animations showConfetti={screen === "new-personal-best"} />
          </>
        )}
      </section>
    </div>
  );
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function Header({ personalBest }: { personalBest: number }) {
  return (
    <header>
      <div className="title">
        <img className="logo-large" src={logoLarge} alt="Typing Speed Test" />
        <div className="title-right">
          <img src={trophyFullImage} alt="" aria-hidden="true" />
          <span>
            Personal best: <strong>{personalBest || 92} WPM</strong>
          </span>
        </div>
      </div>
    </header>
  );
}

function Stats({ values }: { values: string[] }) {
  return (
    <div className="stats">
      {["WPM:", "Accuracy:", "Time:"].map((label, index) => (
        <div className="stat" key={label}>
          <span>{label}</span>
          <strong
            className={
              label === "Accuracy:" && values[index] !== "100%"
                ? "error"
                : label === "Time:" && values[index] !== "0:60"
                  ? "warning"
                  : ""
            }
          >
            {values[index]}
          </strong>
        </div>
      ))}
    </div>
  );
}

function Controls({
  difficulty,
  mode,
  setDifficulty,
  setMode,
}: {
  difficulty: Difficulty;
  mode: Mode;
  setDifficulty: (value: Difficulty) => void;
  setMode: (value: Mode) => void;
}) {
  return (
    <div className="controls">
      <div className="control-group">
        <span>Difficulty:</span>
        {(["easy", "medium", "hard"] as Difficulty[]).map((value) => (
          <button
            key={value}
            className={difficulty === value ? "selected" : ""}
            onClick={() => setDifficulty(value)}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>
      <div className="control-group">
        <span>Mode:</span>
        <button
          className={mode === "timed" ? "selected" : ""}
          onClick={() => setMode("timed")}
        >
          Timed (60s)
        </button>
        <button
          className={mode === "passage" ? "selected" : ""}
          onClick={() => setMode("passage")}
        >
          Passage
        </button>
      </div>
    </div>
  );
}

function Passage({ text }: { text: string }) {
  return <p className="passage">{text}</p>;
}

function TypingPassage({
  text,
  typed,
  onChange,
}: {
  text: string;
  typed: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="typing-passage">
      <input
        autoFocus
        value={typed}
        onChange={onChange}
        aria-label="Type the passage"
      />
      <span>
        {text.split("").map((character, index) => (
          <span
            className={
              index < typed.length
                ? typed[index] === character
                  ? "correct"
                  : "incorrect"
                : index === typed.length
                  ? "cursor"
                  : ""
            }
            key={`${character}-${index}`}
          >
            {character}
          </span>
        ))}
      </span>
    </label>
  );
}

function Restart({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="restart-btn" onClick={onClick}>
      {label}
      <img src={restartIcon} alt="" aria-hidden="true" />
    </button>
  );
}
function Animations({ showConfetti }: { showConfetti: boolean }) {
  return (
    <div>
      {!showConfetti && (
        <>
          <img
            src={starPattern1}
            alt="star-pattern-1"
            aria-hidden="true"
            className="star-pattern-1"
          />
          <img
            src={starPattern2}
            alt="star-pattern"
            aria-hidden="true"
            className="star-pattern-2"
          />
        </>
      )}
      {showConfetti && (
        <img
          src={confettiPattern}
          alt=""
          aria-hidden="true"
          className="confetti-pattern"
        />
      )}
    </div>
  );
}
function Results({
  title,
  subtitle,
  action,
  personalBest,
  wpm,
  accuracy,
  correct,
  incorrect,
  onRestart,
}: {
  title: string;
  subtitle: string;
  action: string;
  personalBest: boolean;
  wpm: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  onRestart: () => void;
}) {
  return (
    <section className="results">
      <div className="most-outer-layer">
        <div className="outer-layer">
          <img
            className="result-icon"
            src={personalBest ? newPersonalBestIcon : completedIcon}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div className="result-cards">
        <div>
          <span>WPM:</span>
          <strong>{wpm}</strong>
        </div>
        <div>
          <span>Accuracy:</span>
          <strong className={accuracy === 100 ? "success" : "error"}>
            {accuracy}%
          </strong>
        </div>
        <div>
          <span>Characters</span>
          <strong>
            <b>{correct}</b>
            <em>/{incorrect}</em>
          </strong>
        </div>
      </div>
      <Restart label={action} onClick={onRestart} />
    </section>
  );
}

export default App;
