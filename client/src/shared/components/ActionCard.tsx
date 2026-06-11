import { useNavigate } from "react-router-dom";
import type { AppRoute } from "../../utils/constants";

interface ActionCardProps {
  icon: string;
  iconClassName: string;
  label: string;
  to: AppRoute;
  onClick?: () => void;
}

export function ActionCard({
  icon,
  iconClassName,
  label,
  to,
  onClick,
}: ActionCardProps) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="action-card app-card"
      onClick={() => {
        if (onClick) onClick();
        else navigate(to);
      }}
    >
      <div className={`action-icon ${iconClassName}`}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <span className="action-label">{label}</span>
    </button>
  );
}
