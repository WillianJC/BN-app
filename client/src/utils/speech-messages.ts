export type SpeechMessageKey =
  | "auth"
  | "auth-prompt"
  | "auth-fallback"
  | "auth-fail"
  | "auth-success"
  | "auth-fields"
  | "auth-name-required"
  | "auth-biometric-register"
  | "auth-biometric-fail"
  | "home"
  | "saldo"
  | "qr"
  | "pagos"
  | "help"
  | "logout"
  | "welcome"
  | "intro"
  | "auth-voice-prompt"
  | "withdraw-pension-ok"
  | "withdraw-bonus-ok"
  | "payments-ok"
  | "payments-fail"
  | "balance-fail"
  | "withdraw-pension-fail"
  | "withdraw-bonus-fail"
  | "wallet-pension-amount"
  | "call-success";

export const speechMessages: Record<SpeechMessageKey, string> = {
  auth: "Bienvenido a su banco de confianza de InclusiApp.",
  "auth-prompt":
    "Por favor use su huella dactilar o reconocimiento facial para ingresar.",
  "auth-fallback":
    "No se detectó lector de huella o rostro. Por favor ingrese su correo y contraseña.",
  "auth-fail":
    "No se pudo verificar su identidad. Intente con correo y contraseña.",
  "auth-success": "Identidad verificada correctamente. Bienvenido.",
  "auth-fields":
    "Por favor ingrese su correo electrónico y contraseña en los campos de texto.",
  "auth-name-required":
    "Por favor ingrese su nombre completo en el campo correspondiente.",
  "auth-biometric-register":
    "Se ha registrado su huella o rostro. Podrá ingresar sin contraseña la próxima vez.",
  "auth-biometric-fail":
    "No se pudo registrar el acceso biométrico. Puede intentarlo más tarde desde su perfil.",
  home: "",
  saldo: "",
  qr: "Muestre el código al cajero para retirar sus billetes.",
  pagos:
    "Seleccione el recibo que desea pagar tocando el dibujo correspondiente.",
  help: "Le estamos conectando con un asesor humano para guiarle paso a paso.",
  logout: "Ha cerrado sesión. Vuelva pronto.",
  welcome: "Bienvenido a InclusiApp.",
  intro: "Bienvenido al prototipo de experiencia financiera inclusiva.",
  "auth-voice-prompt":
    "Toque el botón azul grande que dice entrar con mi rostro para ingresar de manera segura.",
  "withdraw-pension-ok":
    "Su pensión de mil doscientos dólares ha sido cobrada con éxito.",
  "withdraw-bonus-ok": "Su bono de quinientos dólares ha sido cobrado con éxito.",
  "payments-ok": "",
  "payments-fail": "No se pudo iniciar sesión. Verifique su correo y contraseña.",
  "balance-fail": "No se pudo obtener el saldo.",
  "withdraw-pension-fail": "No se pudo cobrar la pensión.",
  "withdraw-bonus-fail": "No se pudo cobrar el bono.",
  "wallet-pension-amount": "COBRAR PENSIÓN ($1,200)",
  "call-success": "La llamada de ayuda se inició correctamente.",
};
