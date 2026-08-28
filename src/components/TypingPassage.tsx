export function TypingPassage({
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
