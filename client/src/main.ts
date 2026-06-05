import {
  login,
  getBalance,
  createWithdrawalCode,
  processPayment,
  triggerSOS,
  getSchedule,
  clearAuthToken,
} from "./api";

// ══════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════
let currentProfile: "normal" | "vision" | "notext" = "normal";
let currentSpeechText = "";
let isMuted = false;
let currentBalance = 450.0;

// ══════════════════════════════════════════════
//  TRANSLATIONS (for "no text" mode)
// ══════════════════════════════════════════════
const translations: Record<string, Record<string, string>> = {
  normal: {
    "auth-title": "Bienvenido a InclusiApp",
    "auth-desc": "Acerque su rostro para ingresar de forma segura.",
    "auth-btn": "ENTRAR CON MI ROSTRO",
    "home-balance-label": "MI DINERO DISPONIBLE",
    "menu-saldo": "VER MI DINERO",
    "menu-cobrar": "COBRAR BONO",
    "menu-pagar": "PAGAR LUZ/AGUA",
    "menu-ayuda": "COMO SE USA?",
    "home-sos-btn": "BOTON DE AUXILIO",
    "btn-volver": "VOLVER",
    "saldo-header": "Mi Dinero",
    "saldo-label": "DINERO QUE TIENE HOY",
    "saldo-alert": "Su pension mensual ya se deposito con exito y esta lista para ser cobrada!",
    "saldo-btn": "IR A COBRAR DINERO",
    "cobro-header": "Retiro de Dinero",
    "cobro-step-1": "MUESTRE ESTE DIBUJO EN LA CAJA:",
    "cobro-step-2": "O DIGA ESTE NUMERO AL CAJERO:",
    "pagos-header": "Pagar Cuentas",
    "pagos-sub": "Que recibo desea pagar hoy?",
    "pago-luz": "RECIBO DE LUZ",
    "pago-agua": "RECIBO DE AGUA",
    "pagos-camera": "ESCANEAR PAPEL DE RECIBO",
    "ayuda-header": "Asistencia Directa",
    "ayuda-sub": "Soporte Inclusivo",
  },
  notext: {
    "auth-title": "HOLA! BIENVENIDO",
    "auth-desc": "Toque el boton grande azul de abajo.",
    "auth-btn": "PRESIONE AQUI PARA ENTRAR",
    "home-balance-label": "MI BILLETERA TIENE",
    "menu-saldo": "VER MI SALDO",
    "menu-cobrar": "SACAR EFECTIVO",
    "menu-pagar": "PAGAR RECIBOS",
    "menu-ayuda": "PEDIR TUTORIAL",
    "home-sos-btn": "NECESITO AYUDA YA!",
    "btn-volver": "ATRAS",
    "saldo-header": "Mi Billetera",
    "saldo-label": "TIENE ESTE DINERO",
    "saldo-alert": "Su dinero ya esta en la cuenta para usar!",
    "saldo-btn": "VER CODIGO DE RETIRO",
    "cobro-header": "Cobrar Dinero",
    "cobro-step-1": "MUESTRE ESTO EN LA TIENDA:",
    "cobro-step-2": "O DIGA ESTOS NUMEROS:",
    "pagos-header": "Mis Pagos",
    "pagos-sub": "Pulsar recibo para pagar:",
    "pago-luz": "SERVICIO DE ENERGIA",
    "pago-agua": "SERVICIO DE AGUA",
    "pagos-camera": "TOMAR FOTO AL RECIBO",
    "ayuda-header": "Llamar por Ayuda",
    "ayuda-sub": "Asistencia por Telefono",
  },
};

// ══════════════════════════════════════════════
//  PHONE CLOCK
// ══════════════════════════════════════════════
function updatePhoneTime(): void {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const el = document.getElementById("phone-time");
  if (el) el.innerText = `${h}:${m}`;
}
setInterval(updatePhoneTime, 1000);
updatePhoneTime();

// ══════════════════════════════════════════════
//  SPEECH SYNTHESIS
// ══════════════════════════════════════════════
function speakSystem(text: string): void {
  currentSpeechText = text;
  const box = document.getElementById("system-speech-box");
  if (box) box.innerText = `"${text}"`;

  if (isMuted) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 0.9;

  const voices = window.speechSynthesis.getVoices();
  const esVoice = voices.find((v) => v.lang.includes("es"));
  if (esVoice) utterance.voice = esVoice;

  window.speechSynthesis.speak(utterance);
}

// ══════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════
function showToast(
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "error" = "info",
): void {
  const toast = document.getElementById("custom-toast")!;
  const iconBg = document.getElementById("toast-icon-bg")!;
  const icon = document.getElementById("toast-icon")!;
  const tTitle = document.getElementById("toast-title")!;
  const tMsg = document.getElementById("toast-message")!;

  tTitle.innerText = title;
  tMsg.innerText = message;

  iconBg.className = "toast-icon-wrap";
  icon.className = "";

  switch (type) {
    case "success":
      iconBg.classList.add("success");
      icon.className = "fa-solid fa-check";
      break;
    case "warning":
      iconBg.classList.add("warning");
      icon.className = "fa-solid fa-triangle-exclamation";
      break;
    case "error":
      iconBg.classList.add("error");
      icon.className = "fa-solid fa-phone-volume";
      break;
    default:
      iconBg.classList.add("info");
      icon.className = "fa-solid fa-info";
  }

  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 4500);
}

// ══════════════════════════════════════════════
//  SCREEN NAVIGATION
// ══════════════════════════════════════════════
function goToAppScreen(screenId: string): void {
  document.querySelectorAll<HTMLElement>(".phone-screen .screen").forEach((s) => {
    s.classList.add("hidden");
  });

  const target = document.getElementById(`screen-${screenId}`);
  if (target) target.classList.remove("hidden");

  // Auto-speak per screen
  switch (screenId) {
    case "home":
      readHomeStatus();
      break;
    case "saldo":
      speakSystem(`Su dinero hoy es de ${currentBalance.toFixed(2)} dolares de pension.`);
      break;
    case "qr":
      speakSystem("Seccion de cobro de dinero. Muestre el dibujo al cajero para retirar sus billetes.");
      break;
    case "pagos":
      speakSystem("Seccion para pagar recibos de luz o agua de manera segura.");
      break;
    case "help":
      speakSystem("Asistencia inmediata. Le estamos comunicando con un asesor que le guiara paso a paso.");
      break;
    case "auth":
      speakSystem("Bienvenido a su banco de confianza de InclusiApp.");
      break;
  }
}

function readHomeStatus(): void {
  let msg = `Hola, su saldo total disponible es de ${currentBalance.toFixed(2)} dolares.`;
  if (currentProfile === "notext") {
    msg = `Hola, bienvenido. En su billetera tiene ${currentBalance.toFixed(2)} billetes disponibles.`;
  }
  speakSystem(msg);
}

// Wire data-nav buttons
document.querySelectorAll<HTMLElement>("[data-nav]").forEach((el) => {
  el.addEventListener("click", () => {
    const target = el.dataset.nav;
    if (target) goToAppScreen(target);
  });
});

// ══════════════════════════════════════════════
//  PROFILE SWITCHING
// ══════════════════════════════════════════════
function applyTranslations(mode: string): void {
  document.querySelectorAll<HTMLElement>("[data-translate]").forEach((elem) => {
    const key = elem.dataset.translate;
    if (key && translations[mode]?.[key]) {
      elem.innerText = translations[mode][key];
    }
  });
}

function switchProfile(profile: "normal" | "vision" | "notext"): void {
  currentProfile = profile;

  // Update profile buttons
  document.querySelectorAll<HTMLElement>(".profile-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.profile === profile) btn.classList.add("active");
  });

  // High contrast mode
  const container = document.getElementById("phone-app-container");
  if (container) {
    if (profile === "vision") {
      container.classList.add("high-contrast-mode");
    } else {
      container.classList.remove("high-contrast-mode");
    }
  }

  // No-text translations
  applyTranslations(profile === "notext" ? "notext" : "normal");

  // Feedback
  if (profile === "vision") {
    speakSystem("Perfil de alta vision activado. Contraste maximo aplicado.");
    showToast("Perfil de Alta Vision", "Interfaz de maximo contraste activada.", "warning");
  } else if (profile === "notext") {
    speakSystem("Modo guiado sin texto activado. Guia de voz continua activada.");
    showToast("Modo Sin Texto", "Textos simplificados y guia de voz intensificada.", "success");
  } else {
    speakSystem("Perfil de adulto mayor estandar cargado.");
    showToast("Perfil Estandar", "Configuracion por defecto cargada.", "info");
  }
}

document.querySelectorAll<HTMLElement>(".profile-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const profile = btn.dataset.profile as "normal" | "vision" | "notext";
    if (profile) switchProfile(profile);
  });
});

// ══════════════════════════════════════════════
//  AUTH / LOGIN (Face biometric)
// ══════════════════════════════════════════════
document.getElementById("btn-login-face")?.addEventListener("click", async () => {
  speakSystem("Verificando identidad de Manuel Torres mediante biometria facial...");

  try {
    const res = await login("12345678", "0000");
    if (res.success && res.user) {
      currentBalance = res.user.balance;
      updateBalanceDisplay();
      speakSystem("Acceso autorizado con exito! Bienvenido Manuel.");
      showToast("Acceso Autorizado", "Identidad verificada mediante biometria.", "success");
      setTimeout(() => goToAppScreen("home"), 800);
    } else {
      // Offline fallback
      speakSystem("Verificando localmente... Acceso autorizado con exito!");
      showToast("Acceso Autorizado", "Identidad verificada (modo offline).", "success");
      setTimeout(() => goToAppScreen("home"), 800);
    }
  } catch {
    // Network error — offline mode
    speakSystem("Verificacion completada. Acceso autorizado con exito!");
    showToast("Acceso Autorizado", "Modo offline — identidad verificada.", "success");
    setTimeout(() => goToAppScreen("home"), 800);
  }
});

// ══════════════════════════════════════════════
//  BALANCE DISPLAY UPDATE
// ══════════════════════════════════════════════
function updateBalanceDisplay(): void {
  const homeBalance = document.getElementById("home-balance-amount");
  if (homeBalance) homeBalance.innerHTML = `$ ${currentBalance.toFixed(2)}<small>USD</small>`;

  const saldoAmount = document.getElementById("saldo-amount");
  if (saldoAmount) saldoAmount.innerText = `$ ${currentBalance.toFixed(2)}`;
}

// ══════════════════════════════════════════════
//  SOS / HELP
// ══════════════════════════════════════════════
document.getElementById("btn-sos")?.addEventListener("click", async () => {
  speakSystem("Activando boton de auxilio prioritario. Conectando con asesoria humana y alertando a su contacto registrado.");
  showToast("Alerta Auxilio Activa", "Asistente humano y copiloto familiar alertados.", "error");

  try {
    await triggerSOS();
  } catch {
    // Offline — still works visually
  }

  goToAppScreen("help");
});

document.getElementById("btn-call-sos")?.addEventListener("click", async () => {
  speakSystem("Iniciando llamada de video interactiva con soporte tecnico.");
  showToast("Llamando a Soporte...", "Un especialista se unira en breve.", "info");

  try {
    await triggerSOS();
  } catch {
    // Offline
  }
});

// ══════════════════════════════════════════════
//  PAYMENTS
// ══════════════════════════════════════════════
document.querySelectorAll<HTMLElement>(".payment-item").forEach((item) => {
  item.addEventListener("click", async () => {
    const service = item.dataset.payService!;
    const amount = parseFloat(item.dataset.payAmount!);

    speakSystem(`Desea realizar el pago de su servicio de ${service} por un monto de ${amount.toFixed(2)} dolares? Confirmando transaccion...`);

    try {
      const res = await processPayment(service, amount);
      if (res.success) {
        speakSystem(`Excelente. El pago de ${service} ha sido cancelado con exito.`);
        showToast("Pago Confirmado", `Servicio ${service} por $${amount.toFixed(2)} cancelado.`, "success");

        // Refresh balance
        try {
          const balRes = await getBalance();
          if (balRes.success && balRes.balance !== undefined) {
            currentBalance = balRes.balance;
            updateBalanceDisplay();
          }
        } catch {
          currentBalance -= amount;
          updateBalanceDisplay();
        }

        goToAppScreen("home");
      } else {
        showToast("Error", res.error ?? "No se pudo procesar el pago.", "warning");
      }
    } catch {
      // Offline mode
      speakSystem(`Pago de ${service} procesado localmente con exito.`);
      showToast("Pago Confirmado (local)", `Servicio ${service} cancelado.`, "success");
      currentBalance -= amount;
      updateBalanceDisplay();
      setTimeout(() => goToAppScreen("home"), 1500);
    }
  });
});

// Camera scan for receipts
document.getElementById("btn-camera-scan")?.addEventListener("click", () => {
  speakSystem("Abriendo camara para escanear el papel de su recibo automaticamente... Recibo de luz reconocido.");
  showToast("Recibo Escaneado", "Camara reconocio recibo de luz por $34.20", "info");

  setTimeout(() => {
    const luzItem = document.querySelector<HTMLElement>("[data-pay-service='LUZ']");
    if (luzItem) luzItem.click();
  }, 1500);
});

// ══════════════════════════════════════════════
//  REQUIREMENTS HIGHLIGHTING
// ══════════════════════════════════════════════
const reqDescriptions: Record<string, string> = {
  rf01: "Interaccion y Audio Multimodal: Guia sonora que narra cada paso del sistema.",
  rf03: "Interfaz Visual Ultra-Simplificada: Acceso a transacciones principales en maximo 2 clics.",
  rf05: "Cobros y Retiros sin Tarjeta: Codigo QR o numerico gigante para retirar dinero.",
  rf07: "Autenticacion Biometrica Asistida: Reconocimiento facial sin contrasenas.",
  rf08: "Boton de Auxilio: Conexion directa inmediata con soporte humano calificado.",
};

document.querySelectorAll<HTMLElement>(".req-item").forEach((item) => {
  item.addEventListener("click", () => {
    const req = item.dataset.req;
    const desc = req ? reqDescriptions[req] : "";
    if (desc) {
      speakSystem(`Requerimiento analizado: ${desc}`);
      showToast(`Requerimiento ${req?.toUpperCase()}`, desc, "info");
    }
    const screen = item.dataset.screen;
    if (screen) goToAppScreen(screen);
  });
});

// ══════════════════════════════════════════════
//  VOICE CONSOLE CONTROLS
// ══════════════════════════════════════════════
document.getElementById("btn-replay-speech")?.addEventListener("click", () => {
  if (currentSpeechText) speakSystem(currentSpeechText);
});

document.getElementById("btn-mute")?.addEventListener("click", () => {
  isMuted = !isMuted;
  const icon = document.getElementById("mute-icon");
  if (icon) {
    icon.className = isMuted
      ? "fa-solid fa-volume-xmark"
      : "fa-solid fa-volume-high";
    icon.style.color = isMuted ? "#ef4444" : "";
  }
  if (isMuted) {
    window.speechSynthesis.cancel();
    showToast("Voz Silenciada", "Ayuda sonora desactivada.", "warning");
  } else {
    showToast("Voz Activada", "Guia de voz en espanol activada.", "success");
    if (currentSpeechText) speakSystem(currentSpeechText);
  }
});

// ══════════════════════════════════════════════
//  AUDIO HELP BUTTONS PER SCREEN
// ══════════════════════════════════════════════
document.getElementById("btn-auth-help")?.addEventListener("click", () => {
  speakSystem("Bienvenido a su banco de confianza. Toque el boton azul grande que dice entrar con mi rostro para ingresar de manera segura.");
});

document.getElementById("btn-home-audio")?.addEventListener("click", () => readHomeStatus());

document.getElementById("btn-saldo-audio")?.addEventListener("click", () => {
  speakSystem(`Su saldo actual es de ${currentBalance.toFixed(2)} dolares. Su pension esta disponible para cobro inmediato.`);
});

document.getElementById("btn-qr-audio")?.addEventListener("click", () => {
  speakSystem("Muestre este codigo al cajero de la tienda o farmacia autorizada para retirar sus billetes de inmediato.");
});

document.getElementById("btn-pagos-audio")?.addEventListener("click", () => {
  speakSystem("Seleccione el recibo que desea pagar tocando el recuadro correspondiente. Tiene recibos de luz y agua pendientes.");
});

document.getElementById("btn-help-audio")?.addEventListener("click", () => {
  speakSystem("Le estamos conectando de inmediato con un asesor humano entrenado para guiarle paso a paso.");
});

// ══════════════════════════════════════════════
//  INTRO BUTTON (Header)
// ══════════════════════════════════════════════
document.getElementById("btn-intro")?.addEventListener("click", () => {
  speakSystem("Bienvenido al prototipo de experiencia financiera inclusiva InclusiApp. Utilice los controles laterales para explorar los perfiles de accesibilidad. Presione entrar con mi rostro para iniciar el simulador.");
});

// ══════════════════════════════════════════════
//  INITIALIZATION
// ══════════════════════════════════════════════
window.addEventListener("load", () => {
  setTimeout(() => {
    speakSystem("Bienvenido a InclusiApp. Presione entrar con mi rostro para iniciar el simulador de banca inclusiva.");
  }, 800);
});
