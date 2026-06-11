export type Profile = "normal" | "vision" | "notext";

export type TranslationKey =
  | "auth-title"
  | "auth-desc"
  | "auth-btn"
  | "auth-btn-ios"
  | "auth-btn-android"
  | "home-balance-label"
  | "menu-saldo"
  | "menu-cobrar"
  | "menu-pagar"
  | "menu-ayuda"
  | "home-sos-btn"
  | "btn-volver"
  | "saldo-header"
  | "saldo-label"
  | "saldo-alert"
  | "saldo-btn"
  | "cobro-header"
  | "cobro-step-1"
  | "cobro-step-2"
  | "pagos-header"
  | "pagos-sub"
  | "pago-luz"
  | "pago-agua"
  | "pagos-camera"
  | "ayuda-header"
  | "ayuda-sub"
  | "create-account"
  | "have-account"
  | "create-account-submit"
  | "login-submit"
  | "auth-voice-help"
  | "collect-pension"
  | "collect-bonus"
  | "logout"
  | "scan-receipt"
  | "call-now"
  | "cancel"
  | "withdraw-info"
  | "withdraw-take-code"
  | "wallet-pension-amount"
  | "wallet-bonus-amount"
  | "404-title"
  | "404-desc"
  | "404-action"
  | "401-title"
  | "401-desc"
  | "401-action"
  | "500-title"
  | "500-desc"
  | "500-action";

export const translations: Record<Profile, Record<TranslationKey, string>> = {
  normal: {
    "auth-title": "Bienvenido a InclusiApp",
    "auth-desc": "Acerque su rostro para ingresar de forma segura.",
    "auth-btn": "ENTRAR CON MI ROSTRO",
    "auth-btn-ios": "ENTRAR CON FACE ID",
    "auth-btn-android": "ENTRAR CON MI HUELLA",
    "home-balance-label": "MI DINERO DISPONIBLE",
    "menu-saldo": "VER MI DINERO",
    "menu-cobrar": "COBRAR BONO",
    "menu-pagar": "PAGAR LUZ/AGUA",
    "menu-ayuda": "¿CÓMO SE USA?",
    "home-sos-btn": "BOTÓN DE AUXILIO",
    "btn-volver": "VOLVER",
    "saldo-header": "Mi Dinero",
    "saldo-label": "DINERO QUE TIENE HOY",
    "saldo-alert":
      "¡Su pensión mensual ya se depositó con éxito y está lista para ser cobrada!",
    "saldo-btn": "IR A COBRAR DINERO",
    "cobro-header": "Retiro de Dinero",
    "cobro-step-1": "MUESTRE ESTE DIBUJO EN LA CAJA:",
    "cobro-step-2": "O DIGA ESTE NÚMERO AL CAJERO:",
    "pagos-header": "Pagar Cuentas",
    "pagos-sub": "¿Qué recibo desea pagar hoy?",
    "pago-luz": "RECIBO DE LUZ",
    "pago-agua": "RECIBO DE AGUA",
    "pagos-camera": "ESCANEAR PAPEL DE RECIBO",
    "ayuda-header": "Asistencia Directa",
    "ayuda-sub": "Soporte Inclusivo",
    "create-account": "CREAR CUENTA NUEVA",
    "have-account": "YA TENGO CUENTA",
    "create-account-submit": "CREAR CUENTA",
    "login-submit": "INICIAR SESIÓN",
    "auth-voice-help": "ESCUCHAR AYUDA DE VOZ",
    "collect-pension": "COBRAR PENSIÓN",
    "collect-bonus": "COBRAR BONO",
    logout: "Cerrar sesión",
    "scan-receipt": "ESCANEAR PAPEL DE RECIBO",
    "call-now": "LLAMAR DE INMEDIATO",
    cancel: "CANCELAR",
    "withdraw-info": "Lleve el código al cajero o tienda autorizada.",
    "withdraw-take-code": "VER CÓDIGO DE RETIRO",
    "wallet-pension-amount": "COBRAR PENSIÓN ($1,200)",
    "wallet-bonus-amount": "COBRAR BONO ($500)",
    "404-title": "Página no encontrada",
    "404-desc": "La ruta que buscas no existe o fue movida.",
    "404-action": "Volver al inicio",
    "401-title": "Necesitas iniciar sesión",
    "401-desc": "Tu sesión expiró o no has ingresado.",
    "401-action": "Iniciar sesión",
    "500-title": "Algo salió mal",
    "500-desc": "Ocurrió un error inesperado. Intenta de nuevo.",
    "500-action": "Reintentar",
  },
  vision: {
    "auth-title": "Bienvenido a InclusiApp",
    "auth-desc": "Acerque su rostro para ingresar de forma segura.",
    "auth-btn": "ENTRAR CON MI ROSTRO",
    "auth-btn-ios": "ENTRAR CON FACE ID",
    "auth-btn-android": "ENTRAR CON MI HUELLA",
    "home-balance-label": "MI DINERO DISPONIBLE",
    "menu-saldo": "VER MI DINERO",
    "menu-cobrar": "COBRAR BONO",
    "menu-pagar": "PAGAR LUZ/AGUA",
    "menu-ayuda": "¿CÓMO SE USA?",
    "home-sos-btn": "BOTÓN DE AUXILIO",
    "btn-volver": "VOLVER",
    "saldo-header": "Mi Dinero",
    "saldo-label": "DINERO QUE TIENE HOY",
    "saldo-alert":
      "¡Su pensión mensual ya se depositó con éxito y está lista para ser cobrada!",
    "saldo-btn": "IR A COBRAR DINERO",
    "cobro-header": "Retiro de Dinero",
    "cobro-step-1": "MUESTRE ESTE DIBUJO EN LA CAJA:",
    "cobro-step-2": "O DIGA ESTE NÚMERO AL CAJERO:",
    "pagos-header": "Pagar Cuentas",
    "pagos-sub": "¿Qué recibo desea pagar hoy?",
    "pago-luz": "RECIBO DE LUZ",
    "pago-agua": "RECIBO DE AGUA",
    "pagos-camera": "ESCANEAR PAPEL DE RECIBO",
    "ayuda-header": "Asistencia Directa",
    "ayuda-sub": "Soporte Inclusivo",
    "create-account": "CREAR CUENTA NUEVA",
    "have-account": "YA TENGO CUENTA",
    "create-account-submit": "CREAR CUENTA",
    "login-submit": "INICIAR SESIÓN",
    "auth-voice-help": "ESCUCHAR AYUDA DE VOZ",
    "collect-pension": "COBRAR PENSIÓN",
    "collect-bonus": "COBRAR BONO",
    logout: "Cerrar sesión",
    "scan-receipt": "ESCANEAR PAPEL DE RECIBO",
    "call-now": "LLAMAR DE INMEDIATO",
    cancel: "CANCELAR",
    "withdraw-info": "Lleve el código al cajero o tienda autorizada.",
    "withdraw-take-code": "VER CÓDIGO DE RETIRO",
    "wallet-pension-amount": "COBRAR PENSIÓN ($1,200)",
    "wallet-bonus-amount": "COBRAR BONO ($500)",
    "404-title": "Página no encontrada",
    "404-desc": "La ruta que buscas no existe o fue movida.",
    "404-action": "Volver al inicio",
    "401-title": "Necesitas iniciar sesión",
    "401-desc": "Tu sesión expiró o no has ingresado.",
    "401-action": "Iniciar sesión",
    "500-title": "Algo salió mal",
    "500-desc": "Ocurrió un error inesperado. Intenta de nuevo.",
    "500-action": "Reintentar",
  },
  notext: {
    "auth-title": "¡HOLA! BIENVENIDO",
    "auth-desc": "Toque el botón grande azul de abajo.",
    "auth-btn": "PRESIONE AQUÍ PARA ENTRAR",
    "auth-btn-ios": "ENTRAR CON ROSTRO",
    "auth-btn-android": "ENTRAR CON HUELLA",
    "home-balance-label": "MI BILLETERA TIENE",
    "menu-saldo": "VER MI SALDO",
    "menu-cobrar": "SACAR EFECTIVO",
    "menu-pagar": "PAGAR RECIBOS",
    "menu-ayuda": "PEDIR TUTORIAL",
    "home-sos-btn": "¡NECESITO AYUDA YA!",
    "btn-volver": "ATRÁS",
    "saldo-header": "Mi Billetera",
    "saldo-label": "TIENE ESTE DINERO",
    "saldo-alert": "¡Su dinero ya está en la cuenta para usar!",
    "saldo-btn": "VER CÓDIGO DE RETIRO",
    "cobro-header": "Cobrar Dinero",
    "cobro-step-1": "MUESTRE ESTO EN LA TIENDA:",
    "cobro-step-2": "O DIGA ESTOS NÚMEROS:",
    "pagos-header": "Mis Pagos",
    "pagos-sub": "Pulsar recibo para pagar:",
    "pago-luz": "SERVICIO DE ENERGÍA",
    "pago-agua": "SERVICIO DE AGUA",
    "pagos-camera": "TOMAR FOTO AL RECIBO",
    "ayuda-header": "Llamar por Ayuda",
    "ayuda-sub": "Asistencia por Teléfono",
    "create-account": "CREAR CUENTA NUEVA",
    "have-account": "YA TENGO CUENTA",
    "create-account-submit": "CREAR CUENTA",
    "login-submit": "INICIAR SESIÓN",
    "auth-voice-help": "ESCUCHAR AYUDA DE VOZ",
    "collect-pension": "COBRAR PENSIÓN",
    "collect-bonus": "COBRAR BONO",
    logout: "Cerrar sesión",
    "scan-receipt": "TOMAR FOTO AL RECIBO",
    "call-now": "LLAMAR DE INMEDIATO",
    cancel: "CANCELAR",
    "withdraw-info": "Lleve el código al cajero o tienda autorizada.",
    "withdraw-take-code": "VER CÓDIGO DE RETIRO",
    "wallet-pension-amount": "COBRAR PENSIÓN ($1,200)",
    "wallet-bonus-amount": "COBRAR BONO ($500)",
    "404-title": "Página no encontrada",
    "404-desc": "La ruta que buscas no existe o fue movida.",
    "404-action": "Volver al inicio",
    "401-title": "Necesitas iniciar sesión",
    "401-desc": "Tu sesión expiró o no has ingresado.",
    "401-action": "Iniciar sesión",
    "500-title": "Algo salió mal",
    "500-desc": "Ocurrió un error inesperado. Intenta de nuevo.",
    "500-action": "Reintentar",
  },
};

export function translate(profile: Profile, key: TranslationKey): string {
  return translations[profile][key] ?? key;
}
