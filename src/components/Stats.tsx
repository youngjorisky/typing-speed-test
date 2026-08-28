import "./Stats.css";

export function Stats({ values }: { values: string[] }) {
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
