/**
 * Theme logic for Konbata (Dark/Light mode)
 */

/**
 * Initializes the theme based on user preference or system default.
 */
export function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  // Detect system preference
  const systemPreference =
    globalThis.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  // Get stored preference or default to system preference
  const storedTheme = localStorage.getItem("theme") || systemPreference;

  // Apply theme
  applyTheme(storedTheme);

  // Event listener for toggle
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") ||
      "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(newTheme);
  });

  // Listen for system changes if no preference stored
  globalThis.matchMedia("(prefers-color-scheme: dark)").addEventListener(
    "change",
    (e) => {
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    },
  );
}

/**
 * Applies the specified theme to the document and persists it.
 * @param {'light' | 'dark'} theme - The theme to apply.
 */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}
