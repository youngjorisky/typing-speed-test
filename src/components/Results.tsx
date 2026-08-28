import completedIcon from "../assets/icon-completed.svg";
import newPersonalBestIcon from "../assets/icon-new-pb.svg";
import { Restart } from "./Restart";

export function Results({
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
