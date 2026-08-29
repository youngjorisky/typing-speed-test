import { useEffect, useId, useRef, useState } from "react";
import "./Controls.css";
import type { Difficulty, Mode } from "../types";

export function Controls({
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
      <MobileDropdown
        label="Difficulty"
        value={difficulty}
        options={[
          { value: "easy", label: "Easy" },
          { value: "medium", label: "Medium" },
          { value: "hard", label: "Hard" },
        ]}
        onChange={(value) => setDifficulty(value as Difficulty)}
      />
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
      <MobileDropdown
        label="Mode"
        value={mode}
        options={[
          { value: "timed", label: "Timed (60s)" },
          { value: "passage", label: "Passage" },
        ]}
        onChange={(value) => setMode(value as Mode)}
      />
    </div>
  );
}

function MobileDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownId = useId();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function closeDropdown(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") setOpen(false);
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      setOpen(true);
    }
  }

  return (
    <div ref={dropdownRef} className="mobile-control-select">
      <button
        type="button"
        className="mobile-control-trigger"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={dropdownId}
        onKeyDown={handleTriggerKeyDown}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        {selectedOption?.label}
        <span className="mobile-control-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div
          className="mobile-control-options"
          id={dropdownId}
          role="radiogroup"
          aria-label={label}
        >
          {options.map((option) => (
            <button
              type="button"
              role="radio"
              aria-checked={option.value === value}
              className="mobile-control-option"
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span className="mobile-control-radio" aria-hidden="true" />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
