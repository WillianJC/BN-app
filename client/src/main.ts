import "./styles.css";

type Profile = "normal" | "vision" | "notext";
type ScreenId = "screen-auth" | "screen-home" | "screen-saldo" | "screen-qr" | "screen-pagos" | "screen-help";
type ToastKind = "success" | "warning" | "info";

const translations: Record<Profile, Record<string, string>> = {
	normal: {
		"auth-title": "Bienvenido a InclusiApp",
		"auth-desc": "Acerque su rostro para ingresar de forma segura.",
		"auth-btn": "ENTRAR CON MI ROSTRO",
		"home-balance-label": "MI DINERO DISPONIBLE",
		"menu-saldo": "VER MI DINERO",
		"menu-cobrar": "COBRAR BONO",
		"menu-pagar": "PAGAR LUZ/AGUA",
		"menu-ayuda": "¿CÓMO SE USA?",
		"home-sos-btn": "BOTÓN DE AUXILIO",
		"btn-volver": "VOLVER",
		"saldo-header": "Mi Dinero",
		"saldo-label": "DINERO QUE TIENE HOY",
		"saldo-alert": "¡Su pensión mensual ya se depositó con éxito y está lista para ser cobrada!",
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
	},
	vision: {
		"auth-title": "Bienvenido a InclusiApp",
		"auth-desc": "Acerque su rostro para ingresar de forma segura.",
		"auth-btn": "ENTRAR CON MI ROSTRO",
		"home-balance-label": "MI DINERO DISPONIBLE",
		"menu-saldo": "VER MI DINERO",
		"menu-cobrar": "COBRAR BONO",
		"menu-pagar": "PAGAR LUZ/AGUA",
		"menu-ayuda": "¿CÓMO SE USA?",
		"home-sos-btn": "BOTÓN DE AUXILIO",
		"btn-volver": "VOLVER",
		"saldo-header": "Mi Dinero",
		"saldo-label": "DINERO QUE TIENE HOY",
		"saldo-alert": "¡Su pensión mensual ya se depositó con éxito y está lista para ser cobrada!",
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
	},
	notext: {
		"auth-title": "¡HOLA! BIENVENIDO",
		"auth-desc": "Toque el botón grande azul de abajo.",
		"auth-btn": "PRESIONE AQUÍ PARA ENTRAR",
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
	},
};

const actionCards = [
	{
		screen: "screen-saldo" as ScreenId,
		icon: "fa-wallet",
		iconClass: "bg-blue-100 text-blue-600",
		labelKey: "menu-saldo",
	},
	{
		screen: "screen-qr" as ScreenId,
		icon: "fa-money-bill-wave",
		iconClass: "bg-emerald-100 text-emerald-600",
		labelKey: "menu-cobrar",
	},
	{
		screen: "screen-pagos" as ScreenId,
		icon: "fa-receipt",
		iconClass: "bg-purple-100 text-purple-600",
		labelKey: "menu-pagar",
	},
	{
		screen: "screen-help" as ScreenId,
		icon: "fa-question",
		iconClass: "bg-rose-100 text-rose-600",
		labelKey: "menu-ayuda",
	},
] as const;

const root = document.querySelector<HTMLDivElement>("#root");

if (!root) {
	throw new Error("No se encontró el nodo #root.");
}

root.innerHTML = `
	<div class="app-stage">
		<main class="app-shell" aria-label="InclusiApp">
			<div class="phone-notch" aria-hidden="true">
				<span></span>
			</div>

			<header class="app-brand-bar">
				<div class="app-brand-lockup">
					<div class="brand-mark" aria-hidden="true">
						<i class="fa-solid fa-hand-holding-heart"></i>
					</div>
					<div>
						<h1>InclusiApp</h1>
						<p>Prototipo de finanzas inclusivas & accesibles</p>
					</div>
				</div>
				<div class="app-chips">
					<span class="status-chip status-chip--active"><i class="fa-solid fa-circle"></i> Modo Simulación</span>
					<button type="button" class="icon-chip" data-action="intro" aria-label="Escuchar introducción">
						<i class="fa-solid fa-volume-high"></i>
					</button>
				</div>
			</header>

			<div class="voice-bar" aria-label="Controles de voz">
				<button type="button" class="voice-button" id="btn-mute" data-action="toggle-mute" aria-pressed="false">
					<i id="mute-icon" class="fa-solid fa-volume-high"></i>
					<span>Voz</span>
				</button>
				<button type="button" class="voice-button voice-button--secondary" data-action="replay">
					<i class="fa-solid fa-arrow-rotate-right"></i>
					<span>Repetir</span>
				</button>
				<p id="voice-summary" class="voice-summary">Cargando el sistema de asistencia de voz...</p>
				<span class="sr-only" id="voice-live" aria-live="polite"></span>
			</div>

			<div class="profile-switcher" aria-label="Perfiles de accesibilidad">
				<button type="button" class="profile-pill is-active" data-profile="normal">
					Estándar
				</button>
				<button type="button" class="profile-pill" data-profile="vision">
					Alta visión
				</button>
				<button type="button" class="profile-pill" data-profile="notext">
					Sin texto
				</button>
			</div>

			<div id="phone-app-container" class="phone-frame">
				<div class="status-bar">
					<span id="phone-time">10:30</span>
					<div>
						<i class="fa-solid fa-wifi"></i>
						<i class="fa-solid fa-signal"></i>
						<i class="fa-solid fa-battery-three-quarters"></i>
					</div>
				</div>

				<section id="screen-auth" class="phone-screen app-bg">
					<div class="screen-hero">
						<span class="hero-icon app-icon"><i class="fa-solid fa-hand-holding-heart"></i></span>
						<h2 class="app-title" data-translate="auth-title">Bienvenido a InclusiApp</h2>
						<p class="app-copy" data-translate="auth-desc">Acerque su rostro para ingresar de forma segura.</p>
					</div>

					<div class="screen-visual">
						<div class="face-ring app-card">
							<i class="fa-solid fa-face-smile app-icon"></i>
							<div class="scanner-line" aria-hidden="true"></div>
						</div>
						<span class="status-note app-copy"><i class="fa-solid fa-shield-halved"></i> Reconocimiento Activo</span>
					</div>

					<div class="screen-actions">
						<button type="button" class="primary-action app-btn-accent" data-action="login">
							<i class="fa-solid fa-fingerprint"></i>
							<span data-translate="auth-btn">ENTRAR CON MI ROSTRO</span>
						</button>
						<button type="button" class="secondary-action app-btn-secondary" data-action="speak-auth">
							<i class="fa-solid fa-volume-high"></i>
							<span>ESCUCHAR AYUDA DE VOZ</span>
						</button>
					</div>
				</section>

				<section id="screen-home" class="phone-screen app-bg is-hidden">
					<div class="screen-header">
						<div class="user-chip">
							<div class="avatar">M</div>
							<div>
								<p class="eyebrow">Hola,</p>
								<h3>Manuel Torres</h3>
							</div>
						</div>
						<button type="button" class="mini-action app-btn-secondary" data-action="speak-home" aria-label="Escuchar estado de la cuenta">
							<i class="fa-solid fa-volume-high"></i>
						</button>
					</div>

					<div class="balance-card app-card">
						<div>
							<p class="balance-label" data-translate="home-balance-label">MI DINERO DISPONIBLE</p>
							<div class="balance-amount">$ 450.00 <span>USD</span></div>
							<p class="balance-subtitle">Pensión de Jubilación al día</p>
						</div>
						<div class="balance-orb" aria-hidden="true"></div>
					</div>

					<div class="action-grid">
						${actionCards
							.map(
								(card) => `
									<button type="button" class="action-card app-card" data-action="screen" data-screen="${card.screen}">
										<div class="action-icon ${card.iconClass}"><i class="fa-solid ${card.icon}"></i></div>
										<span class="action-label" data-translate="${card.labelKey}"></span>
									</button>
								`,
							)
							.join("")}
					</div>

					<button type="button" class="sos-button app-btn-accent" data-action="sos">
						<i class="fa-solid fa-phone-volume"></i>
						<span data-translate="home-sos-btn">BOTÓN DE AUXILIO</span>
					</button>
				</section>

				<section id="screen-saldo" class="phone-screen app-bg is-hidden">
					<div class="screen-toolbar">
						<button type="button" class="back-button app-btn-secondary" data-action="back-home">
							<i class="fa-solid fa-arrow-left"></i>
							<span data-translate="btn-volver">VOLVER</span>
						</button>
						<h3 data-translate="saldo-header">Mi Dinero</h3>
						<button type="button" class="mini-action app-btn-secondary" data-action="speak-saldo" aria-label="Escuchar saldo">
							<i class="fa-solid fa-volume-high"></i>
						</button>
					</div>

					<div class="center-stack">
						<div class="money-icon app-icon"><i class="fa-solid fa-piggy-bank"></i></div>
						<p class="app-copy strong" data-translate="saldo-label">DINERO QUE TIENE HOY</p>
						<div class="balance-big app-text">$ 450.00</div>
						<p class="app-copy">Pesos / Dólares Equivalentes</p>
						<div class="notice-card app-card">
							<i class="fa-solid fa-circle-check"></i>
							<p class="app-copy strong" data-translate="saldo-alert">¡Su pensión mensual ya se depositó con éxito y está lista para ser cobrada!</p>
						</div>
					</div>

					<button type="button" class="primary-action app-btn-accent" data-action="screen" data-screen="screen-qr">
						<i class="fa-solid fa-qrcode"></i>
						<span data-translate="saldo-btn">IR A COBRAR DINERO</span>
					</button>
				</section>

				<section id="screen-qr" class="phone-screen app-bg is-hidden">
					<div class="screen-toolbar">
						<button type="button" class="back-button app-btn-secondary" data-action="back-home">
							<i class="fa-solid fa-arrow-left"></i>
							<span data-translate="btn-volver">VOLVER</span>
						</button>
						<h3 data-translate="cobro-header">Retiro de Dinero</h3>
						<button type="button" class="mini-action app-btn-secondary" data-action="speak-qr" aria-label="Escuchar retiro">
							<i class="fa-solid fa-volume-high"></i>
						</button>
					</div>

					<div class="center-stack center-stack--tight">
						<p class="step-badge app-text" data-translate="cobro-step-1">MUESTRE ESTE DIBUJO EN LA CAJA:</p>
						<div class="qr-card app-card">
							<div class="qr-grid" aria-hidden="true">
								<span></span><span></span><span></span><span></span>
								<span></span><span class="dark"></span><span></span><span></span>
								<span></span><span></span><span></span><span class="dark"></span>
								<span></span><span class="dark"></span><span></span><span></span>
							</div>
						</div>
						<p class="app-copy strong" data-translate="cobro-step-2">O DIGA ESTE NÚMERO AL CAJERO:</p>
						<div class="code-pill app-card">4590 - 23</div>
						<div class="notice-card notice-card--success app-card">
							<i class="fa-solid fa-circle-info"></i>
							<p class="app-copy strong">Lleve el código al cajero o tienda autorizada.</p>
						</div>
					</div>
				</section>

				<section id="screen-pagos" class="phone-screen app-bg is-hidden">
					<div class="screen-toolbar">
						<button type="button" class="back-button app-btn-secondary" data-action="back-home">
							<i class="fa-solid fa-arrow-left"></i>
							<span data-translate="btn-volver">VOLVER</span>
						</button>
						<h3 data-translate="pagos-header">Pagar Cuentas</h3>
						<button type="button" class="mini-action app-btn-secondary" data-action="speak-pagos" aria-label="Escuchar pagos">
							<i class="fa-solid fa-volume-high"></i>
						</button>
					</div>

					<div class="center-stack center-stack--tight">
						<p class="app-copy strong" data-translate="pagos-sub">¿Qué recibo desea pagar hoy?</p>

						<button type="button" class="service-item app-card" data-action="pay-service" data-service="LUZ">
							<div class="service-info">
								<div class="service-icon service-icon--light"><i class="fa-solid fa-bolt"></i></div>
								<div>
									<h4 data-translate="pago-luz">RECIBO DE LUZ</h4>
									<p>Vence en 3 días</p>
								</div>
							</div>
							<strong>$ 34.20</strong>
						</button>

						<button type="button" class="service-item app-card" data-action="pay-service" data-service="AGUA">
							<div class="service-info">
								<div class="service-icon service-icon--water"><i class="fa-solid fa-droplet"></i></div>
								<div>
									<h4 data-translate="pago-agua">RECIBO DE AGUA</h4>
									<p>Vence en 5 días</p>
								</div>
							</div>
							<strong>$ 15.00</strong>
						</button>

						<button type="button" class="secondary-action app-btn-secondary" data-action="scan-receipt">
							<i class="fa-solid fa-camera"></i>
							<span data-translate="pagos-camera">ESCANEAR PAPEL DE RECIBO</span>
						</button>
					</div>
				</section>

				<section id="screen-help" class="phone-screen app-bg is-hidden">
					<div class="screen-toolbar">
						<button type="button" class="back-button app-btn-secondary" data-action="back-home">
							<i class="fa-solid fa-arrow-left"></i>
							<span data-translate="btn-volver">VOLVER</span>
						</button>
						<h3 data-translate="ayuda-header">Asistencia Directa</h3>
						<button type="button" class="mini-action app-btn-secondary" data-action="speak-help" aria-label="Escuchar ayuda">
							<i class="fa-solid fa-volume-high"></i>
						</button>
					</div>

					<div class="center-stack">
						<div class="support-avatar app-card"><i class="fa-solid fa-user-tie"></i></div>
						<div>
							<h4 class="app-text" data-translate="ayuda-sub">Soporte Inclusivo</h4>
							<p class="app-copy">Conexión de audio y video</p>
						</div>
						<div class="notice-card app-card">
							<i class="fa-solid fa-shield-halved"></i>
							<p class="app-copy strong">Puede dar acceso temporal controlado a su hijo o asesor para ayudarle.</p>
						</div>
					</div>

					<div class="help-actions">
						<button type="button" class="primary-action app-btn-accent" data-action="call-now">
							<i class="fa-solid fa-phone"></i>
							<span>LLAMAR DE INMEDIATO</span>
						</button>
						<button type="button" class="secondary-action app-btn-secondary" data-action="back-home">
							CANCELAR
						</button>
					</div>
				</section>

				<button type="button" class="home-pill" data-action="back-home" aria-label="Volver a inicio">
					<span></span>
				</button>
			</div>
		</main>
	</div>

	<div class="toast" id="custom-toast" role="status" aria-live="polite">
		<div class="toast-icon" id="toast-icon-bg">
			<i id="toast-icon" class="fa-solid fa-info"></i>
		</div>
		<div>
			<h4 id="toast-title">Alerta</h4>
			<p id="toast-message">Mensaje del sistema</p>
		</div>
	</div>
`;

const state = {
	profile: "normal" as Profile,
	currentScreen: "screen-auth" as ScreenId,
	muted: false,
	currentSpeechText: "",
	toastTimer: 0 as number | undefined,
};

const elements = {
	phoneTime: root.querySelector<HTMLElement>("#phone-time"),
	voiceSummary: root.querySelector<HTMLElement>("#voice-summary"),
	voiceLive: root.querySelector<HTMLElement>("#voice-live"),
	muteIcon: root.querySelector<HTMLElement>("#mute-icon"),
	muteButton: root.querySelector<HTMLButtonElement>("#btn-mute"),
	toast: root.querySelector<HTMLElement>("#custom-toast"),
	toastIconBg: root.querySelector<HTMLElement>("#toast-icon-bg"),
	toastIcon: root.querySelector<HTMLElement>("#toast-icon"),
	toastTitle: root.querySelector<HTMLElement>("#toast-title"),
	toastMessage: root.querySelector<HTMLElement>("#toast-message"),
};

const screenMessages: Record<ScreenId, string> = {
	"screen-auth": "Bienvenido a su banco de confianza de InclusiApp.",
	"screen-home": "Sección principal. Aquí puede ver su dinero, cobrar bonos, pagar cuentas o pedir ayuda.",
	"screen-saldo": "Sección: Mi dinero. Su dinero hoy es de cuatrocientos cincuenta dólares de pensión.",
	"screen-qr": "Sección de cobro de dinero. Muestre el dibujo en la pantalla de su celular al cajero para retirar sus billetes.",
	"screen-pagos": "Sección para pagar recibos de luz o agua de manera segura.",
	"screen-help": "Asistencia inmediata. Le estamos comunicando con un asesor que le guiará paso a paso.",
};

function updatePhoneTime(): void {
	if (!elements.phoneTime) {
		return;
	}

	const now = new Date();
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	elements.phoneTime.textContent = `${hours}:${minutes}`;
}

function applyTranslations(): void {
	const dictionary = translations[state.profile];
	root.querySelectorAll<HTMLElement>("[data-translate]").forEach((node) => {
		const key = node.dataset.translate;
		if (key && dictionary[key]) {
			node.textContent = dictionary[key];
		}
	});
}

function updateTheme(): void {
	document.body.classList.toggle("high-contrast-mode", state.profile === "vision");
}

function updateVoiceControls(): void {
	if (elements.muteIcon) {
		elements.muteIcon.className = state.muted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
	}

	if (elements.muteButton) {
		elements.muteButton.setAttribute("aria-pressed", String(state.muted));
	}
}

function updateProfileControls(): void {
	root.querySelectorAll<HTMLElement>("[data-profile]").forEach((button) => {
		button.classList.toggle("is-active", button.dataset.profile === state.profile);
	});
}

function updateScreenVisibility(): void {
	root.querySelectorAll<HTMLElement>(".phone-screen").forEach((screen) => {
		const isActive = screen.id === state.currentScreen;
		screen.classList.toggle("is-hidden", !isActive);
		screen.classList.toggle("is-active", isActive);
	});
}

function setScreen(screenId: ScreenId): void {
	state.currentScreen = screenId;
	updateScreenVisibility();
	speakSystem(screenMessages[screenId]);
}

function showToast(title: string, message: string, kind: ToastKind = "info"): void {
	if (!elements.toast || !elements.toastTitle || !elements.toastMessage || !elements.toastIconBg || !elements.toastIcon) {
		return;
	}

	const iconByKind: Record<ToastKind, string> = {
		success: "fa-circle-check",
		warning: "fa-triangle-exclamation",
		info: "fa-circle-info",
	};

	const toneByKind: Record<ToastKind, string> = {
		success: "toast--success",
		warning: "toast--warning",
		info: "toast--info",
	};

	elements.toast.className = `toast ${toneByKind[kind]} is-visible`;
	elements.toastTitle.textContent = title;
	elements.toastMessage.textContent = message;
	elements.toastIcon.className = `fa-solid ${iconByKind[kind]}`;

	if (state.toastTimer) {
		window.clearTimeout(state.toastTimer);
	}

	state.toastTimer = window.setTimeout(() => {
		elements.toast?.classList.remove("is-visible");
	}, 2600);
}

function speakSystem(text: string): void {
	state.currentSpeechText = text;

	if (elements.voiceSummary) {
		elements.voiceSummary.textContent = text;
	}

	if (elements.voiceLive) {
		elements.voiceLive.textContent = text;
	}

	if (state.muted) {
		return;
	}

	window.speechSynthesis.cancel();

	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = "es-ES";

	const voices = window.speechSynthesis.getVoices();
	const esVoice = voices.find((voice) => voice.lang.includes("es"));
	if (esVoice) {
		utterance.voice = esVoice;
	}

	utterance.rate = 0.9;
	window.speechSynthesis.speak(utterance);
}

function toggleMute(): void {
	state.muted = !state.muted;
	updateVoiceControls();

	if (state.muted) {
		window.speechSynthesis.cancel();
		showToast("Voz Silenciada", "Se ha desactivado la ayuda sonora del simulador.", "warning");
		return;
	}

	showToast("Voz Activada", "Se ha vuelto a activar la guía de voz en español.", "success");
	replayCurrentSpeech();
}

function replayCurrentSpeech(): void {
	if (state.currentSpeechText) {
		speakSystem(state.currentSpeechText);
	}
}

function switchProfile(profile: Profile): void {
	state.profile = profile;
	updateTheme();
	applyTranslations();
	updateProfileControls();
	showToast(
		profile === "vision" ? "Modo Alta Visión" : profile === "notext" ? "Modo Guiado Activado" : "Perfil Estándar",
		profile === "vision"
			? "Se activó el contraste máximo para mejorar la lectura."
			: profile === "notext"
				? "La interfaz prioriza iconos y audio para navegación simple."
				: "Diseño estándar activado para el usuario mayor.",
		"info",
	);
}

function goHome(): void {
	setScreen("screen-home");
}

function simulateLogin(): void {
	showToast("Ingreso correcto", "Reconocimiento facial simulado con éxito.", "success");
	setScreen("screen-home");
}

function triggerSOS(): void {
	setScreen("screen-help");
	showToast("Llamando ayuda", "Se está conectando con un asesor humano.", "warning");
}

function simulatePayService(serviceName: string, amount: string): void {
	showToast(`${serviceName} seleccionado`, `Se iniciará el pago por ${amount}.`, "success");
	speakSystem(`Ha elegido pagar ${serviceName} por ${amount}.`);
}

function simulateCameraScan(): void {
	showToast("Escaneo activo", "La cámara está leyendo el recibo.", "info");
}

function simulateCall(): void {
	showToast("Llamada iniciada", "Un asesor está atendiendo su solicitud.", "success");
	speakSystem("La llamada de ayuda se inició correctamente.");
}

root.addEventListener("click", (event) => {
	const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");

	if (!target) {
		return;
	}

	const action = target.dataset.action;

	if (action === "toggle-mute") {
		toggleMute();
		return;
	}

	if (action === "replay") {
		replayCurrentSpeech();
		return;
	}

	if (action === "intro") {
		speakSystem("Bienvenido al prototipo de experiencia financiera inclusiva.");
		return;
	}

	if (action === "login") {
		simulateLogin();
		return;
	}

	if (action === "speak-auth") {
		speakSystem("Toque el botón azul grande que dice entrar con mi rostro para ingresar de manera segura.");
		return;
	}

	if (action === "speak-home") {
		speakSystem("Su saldo disponible es de cuatrocientos cincuenta dólares. Puede cobrar bonos, pagar servicios o pedir ayuda.");
		return;
	}

	if (action === "speak-saldo") {
		speakSystem("Su dinero hoy es de cuatrocientos cincuenta dólares de pensión.");
		return;
	}

	if (action === "speak-qr") {
		speakSystem("Muestre el código al cajero para retirar sus billetes.");
		return;
	}

	if (action === "speak-pagos") {
		speakSystem("Seleccione el recibo que desea pagar tocando el dibujo correspondiente.");
		return;
	}

	if (action === "speak-help") {
		speakSystem("Le estamos conectando con un asesor humano para guiarle paso a paso.");
		return;
	}

	if (action === "sos") {
		triggerSOS();
		return;
	}

	if (action === "back-home") {
		goHome();
		return;
	}

	if (action === "screen") {
		const screenId = target.dataset.screen as ScreenId | undefined;
		if (screenId) {
			setScreen(screenId);
		}
		return;
	}

	if (action === "pay-service") {
		const service = target.dataset.service;
		if (service === "LUZ") {
			simulatePayService("Luz", "$ 34.20");
			return;
		}

		if (service === "AGUA") {
			simulatePayService("Agua", "$ 15.00");
		}
		return;
	}

	if (action === "scan-receipt") {
		simulateCameraScan();
		return;
	}

	if (action === "call-now") {
		simulateCall();
	}
});

root.addEventListener("click", (event) => {
	const profileButton = (event.target as HTMLElement).closest<HTMLElement>("[data-profile]");
	if (!profileButton) {
		return;
	}

	const profile = profileButton.dataset.profile as Profile | undefined;
	if (profile) {
		switchProfile(profile);
	}
});

updatePhoneTime();
window.setInterval(updatePhoneTime, 1000);
applyTranslations();
updateTheme();
updateVoiceControls();
updateProfileControls();
updateScreenVisibility();
speakSystem("Bienvenido a su banco de confianza de InclusiApp.");
