import { useEffect, useRef } from "react";

export function TypingPassage({
  text,
  typed,
  onChange,
}: {
  text: string;
  typed: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const passageRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    const cursor = passageRef.current?.querySelector<HTMLElement>(".cursor");
    if (!cursor) return;

    const { top, bottom } = cursor.getBoundingClientRect();
    const topMargin = 96;
    const bottomMargin = 128;

    if (top < topMargin) {
      window.scrollBy({ top: top - topMargin, behavior: "smooth" });
    } else if (bottom > window.innerHeight - bottomMargin) {
      window.scrollBy({
        top: bottom - (window.innerHeight - bottomMargin),
        behavior: "smooth",
      });
    }
  }, [typed]);

  return (
    <label ref={passageRef} className="typing-passage">
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
