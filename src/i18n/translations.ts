export type Language = "en" | "ca" | "es";

export interface Translations {
  // SpeedReader display
  idlePlaceholder: string;
  finishedMessage: string;
  // Controls
  play: string;
  pause: string;
  restart: string;
  // TextInput
  changeText: string;
  hideTextPanel: string;
  textareaPlaceholder: string;
  useDemoText: string;
  // ThemeToggle
  switchToLight: string;
  switchToDark: string;
  // Keyboard hint
  keyboardHint: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    idlePlaceholder: "Press play to start reading",
    finishedMessage: "Finished — press restart to read again",
    play: "▶ Play",
    pause: "⏸ Pause",
    restart: "↺ Restart",
    changeText: "Change text ↓",
    hideTextPanel: "Hide text panel ↑",
    textareaPlaceholder: "Paste your own text here…",
    useDemoText: "Use demo text",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    keyboardHint: "Space · R · ← / →",
  },
  ca: {
    idlePlaceholder: "Prem play per iniciar la lectura",
    finishedMessage: "Acabat — prem reinicia per tornar a llegir",
    play: "▶ Reprodueix",
    pause: "⏸ Pausa",
    restart: "↺ Reinicia",
    changeText: "Canvia el text ↓",
    hideTextPanel: "Amaga el panell ↑",
    textareaPlaceholder: "Enganxa el teu text aquí…",
    useDemoText: "Usa el text de demo",
    switchToLight: "Canvia a mode clar",
    switchToDark: "Canvia a mode fosc",
    keyboardHint: "Espai · R · ← / →",
  },
  es: {
    idlePlaceholder: "Pulsa play para empezar a leer",
    finishedMessage: "Terminado — pulsa reiniciar para volver a leer",
    play: "▶ Reproducir",
    pause: "⏸ Pausa",
    restart: "↺ Reiniciar",
    changeText: "Cambiar texto ↓",
    hideTextPanel: "Ocultar panel ↑",
    textareaPlaceholder: "Pega tu texto aquí…",
    useDemoText: "Usar texto de demo",
    switchToLight: "Cambiar a modo claro",
    switchToDark: "Cambiar a modo oscuro",
    keyboardHint: "Espacio · R · ← / →",
  },
};
