export type Language = "en" | "ca" | "es";

export interface Translations {
  // App intro
  appTagline: string;
  appDescription: string;
  // SpeedReader display
  idlePlaceholder: string;
  clickToResume: string;
  clickToPause: string;
  // TextInput
  changeText: string;
  hideTextPanel: string;
  textareaPlaceholder: string;
  useDemoText: string;
  // ThemeToggle
  switchToLight: string;
  switchToDark: string;
  // Controls
  wpmLabel: string;
  wpmTooltip: string;
  // Keyboard hint
  keyboardHint: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTagline: "Read faster, one word at a time.",
    appDescription:
      "Each word appears at a fixed point — focus on the highlighted letter to keep your reading flow.",
    idlePlaceholder: "Click to play",
    clickToResume: "Click to resume",
    clickToPause: "Click to pause",
    changeText: "Change text",
    hideTextPanel: "Hide text panel",
    textareaPlaceholder: "Paste your own text here…",
    useDemoText: "Use demo text",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    wpmLabel: "WPM",
    wpmTooltip: "Words per minute",
    keyboardHint: "Space · R · ← / →",
  },
  ca: {
    appTagline: "Llegeix més ràpid, paraula a paraula.",
    appDescription:
      "Cada paraula apareix en un punt fix — centra't en la lletra destacada per mantenir el ritme.",
    idlePlaceholder: "Clica per reproduir",
    clickToResume: "Clica per continuar",
    clickToPause: "Clica per pausar",
    changeText: "Canvia el text",
    hideTextPanel: "Amaga el panell",
    textareaPlaceholder: "Enganxa el teu text aquí…",
    useDemoText: "Usa el text de demo",
    switchToLight: "Canvia a mode clar",
    switchToDark: "Canvia a mode fosc",
    wpmLabel: "PPM",
    wpmTooltip: "Paraules per minut",
    keyboardHint: "Espai · R · ← / →",
  },
  es: {
    appTagline: "Lee más rápido, palabra a palabra.",
    appDescription:
      "Cada palabra aparece en un punto fijo — céntrate en la letra destacada para mantener el ritmo.",
    idlePlaceholder: "Haz clic para reproducir",
    clickToResume: "Haz clic para continuar",
    clickToPause: "Haz clic para pausar",
    changeText: "Cambiar texto",
    hideTextPanel: "Ocultar panel",
    textareaPlaceholder: "Pega tu texto aquí…",
    useDemoText: "Usar texto de demo",
    switchToLight: "Cambiar a modo claro",
    switchToDark: "Cambiar a modo oscuro",
    wpmLabel: "PPM",
    wpmTooltip: "Palabras por minuto",
    keyboardHint: "Espacio · R · ← / →",
  },
};
