export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPassword(value: string): boolean {
  return value.length >= 6;
}

export function isValidName(value: string): boolean {
  return value.trim().length >= 2;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  name?: string;
}

export function validateLoginForm(
  email: string,
  password: string,
  name?: string,
  requireName = false,
): LoginFormErrors {
  const errors: LoginFormErrors = {};
  if (!email) {
    errors.email = "Ingrese su correo electrónico.";
  } else if (!isValidEmail(email)) {
    errors.email = "El correo no es válido.";
  }
  if (!password) {
    errors.password = "Ingrese su contraseña.";
  } else if (!isValidPassword(password)) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }
  if (requireName && !isValidName(name ?? "")) {
    errors.name = "Ingrese su nombre completo.";
  }
  return errors;
}
