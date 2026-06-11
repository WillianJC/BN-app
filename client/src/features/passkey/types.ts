export interface PasskeyOptionsResponse {
  challenge: string;
  _challengeKey?: string;
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
