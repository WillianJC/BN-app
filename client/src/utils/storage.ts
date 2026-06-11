import { MUTED_STORAGE_KEY, PROFILE_STORAGE_KEY } from "./constants";
import type { Profile } from "./i18n";

export function getStoredProfile(): Profile {
  if (typeof window === "undefined") return "normal";
  const value = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (value === "vision" || value === "notext" || value === "normal") {
    return value;
  }
  return "normal";
}

export function setStoredProfile(profile: Profile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_STORAGE_KEY, profile);
}

export function getStoredMuted(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(MUTED_STORAGE_KEY) === "true";
}

export function setStoredMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MUTED_STORAGE_KEY, String(muted));
}
