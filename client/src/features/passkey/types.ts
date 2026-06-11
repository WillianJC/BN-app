export type PasskeyPlatform = "ios" | "android" | "desktop";

export interface PasskeyOptionsResponse {
  challenge: string;
  [key: string]: unknown;
}

export interface PasskeyUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface PasskeyLoginResponse {
  message: string;
  user: PasskeyUser;
}
