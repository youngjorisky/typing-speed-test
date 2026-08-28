import restartIcon from "../assets/icon-restart.svg";

export function Restart({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button className="restart-btn" onClick={onClick}>
      {label}
      <img src={restartIcon} alt="" aria-hidden="true" />
    </button>
  );
}
