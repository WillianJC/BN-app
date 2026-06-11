import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Profile } from "../../utils/i18n";
import {
  getStoredMuted,
  getStoredProfile,
  setStoredMuted,
  setStoredProfile,
} from "../../utils/storage";

interface ProfileContextValue {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  muted: boolean;
  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
  highContrast: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile>(() => getStoredProfile());
  const [muted, setMutedState] = useState<boolean>(() => getStoredMuted());

  useEffect(() => {
    setStoredProfile(profile);
  }, [profile]);

  useEffect(() => {
    setStoredMuted(muted);
  }, [muted]);

  useEffect(() => {
    document.body.classList.toggle("high-contrast-mode", profile === "vision");
  }, [profile]);

  const setProfile = useCallback((next: Profile) => {
    setProfileState(next);
  }, []);

  const setMuted = useCallback((next: boolean) => {
    setMutedState(next);
  }, []);

  const toggleMute = useCallback(() => {
    setMutedState((prev) => !prev);
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      setProfile,
      muted,
      setMuted,
      toggleMute,
      highContrast: profile === "vision",
    }),
    [profile, setProfile, muted, setMuted, toggleMute],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}
