import { useProfile } from "../context/ProfileContext";
import type { Profile } from "../../utils/i18n";

interface ProfileSwitcherProps {
  onChange?: (profile: Profile) => void;
}

export function ProfileSwitcher({ onChange }: ProfileSwitcherProps) {
  const { profile, setProfile } = useProfile();
  const isHighVision = profile === "vision";

  const handleToggleVision = () => {
    const nextProfile: Profile = isHighVision ? "normal" : "vision";
    setProfile(nextProfile);
    onChange?.(nextProfile);
  };

  return (
    <section className="profile-switcher app-card" aria-label="Configuración de accesibilidad">
      <div className="profile-setting-icon" aria-hidden="true">
        <i className="fa-solid fa-gear" />
      </div>
      <div className="profile-setting-copy">
        <h2>Modo Alta Visión</h2>
        <p>Alto contraste negro/amarillo y letras grandes.</p>
      </div>
      <button
        type="button"
        className={`vision-switch ${isHighVision ? "is-on" : ""}`}
        role="switch"
        aria-checked={isHighVision}
        aria-label={`${isHighVision ? "Apagar" : "Encender"} Modo Alta Visión`}
        onClick={handleToggleVision}
      >
        <span className="vision-switch-track">
          <span className="vision-switch-thumb" />
        </span>
      </button>
    </section>
  );
}
