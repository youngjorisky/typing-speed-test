import logoLarge from "../assets/logo-large.svg";
import logoSmall from "../assets/logo-small.svg";
import trophyFullImage from "../assets/trophy-solid-full.svg";
import "./Header.css";

export function Header({ personalBest }: { personalBest: number }) {
  return (
    <header>
      <div className="title">
        <img className="logo-large" src={logoLarge} alt="Typing Speed Test" />
        <img className="logo-small" src={logoSmall} alt="Typing Speed Test" />
        <div className="title-right">
          <img src={trophyFullImage} alt="" aria-hidden="true" />
          <span className="personal-best-full">
            Personal best: <strong>{personalBest || 92} WPM</strong>
          </span>
          <span className="personal-best-short" aria-hidden="true">
            Best: <strong>{personalBest || 92} WPM</strong>
          </span>
        </div>
      </div>
    </header>
  );
}
