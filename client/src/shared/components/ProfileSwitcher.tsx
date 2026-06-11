import { useProfile } from "../context/ProfileContext";
import { translate } from "../../utils/i18n";

const PROFILES: { id: "normal" | "vision" | "notext"; icon: string; label: string }[] = [
  { id: "normal", icon: "fa-font", label: "Estándar" },
  { id: "vision", icon: "fa-eye", label: "Alta Visión" },
  { id: "notext", icon: "fa-hand-pointer", label: "Guiado" },
];

interface ProfileSwitcherProps {
  onChange?: (profile: "normal" | "vision" | "notext") => void;
}

export function ProfileSwitcher({ onChange }: ProfileSwitcherProps) {
  const { profile, setProfile } = useProfile();

  return (
    <div className="profile-switcher" role="group" aria-label="Perfiles de accesibilidad">
      {PROFILES.map((p) => (
        <button
          key={p.id}
          type="button"
          className={`profile-pill ${p.id === profile ? "is-active" : ""}`}
          data-profile={p.id}
          onClick={() => {
            setProfile(p.id);
            onChange?.(p.id);
          }}
        >
          <i className={`fa-solid ${p.icon}`} aria-hidden="true" /> {translate(profile, "auth-voice-help").includes("VOZ") ? p.label : p.label}
        </button>
      ))}
    </div>
  );
}
