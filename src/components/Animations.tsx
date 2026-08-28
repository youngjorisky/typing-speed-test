import confettiPattern from "../assets/pattern-confetti.svg";
import starPattern1 from "../assets/pattern-star-1.svg";
import starPattern2 from "../assets/pattern-star-2.svg";

export function Animations({ showConfetti }: { showConfetti: boolean }) {
  return (
    <div>
      {!showConfetti && (
        <>
          <img
            src={starPattern1}
            alt=""
            aria-hidden="true"
            className="star-pattern-1"
          />
          <img
            src={starPattern2}
            alt=""
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
