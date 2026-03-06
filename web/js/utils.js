/**
 * Utility functions for Konbata
 */

/**
 * Shows a toast message to the user.
 * @param {string} message - The message to display.
 * @param {'success' | 'error' | 'info'} type - The type of toast.
 */
export function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "opacity 0.3s, transform 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Copies text to the clipboard.
 * @param {string} text - The text to copy.
 * @returns {Promise<boolean>} - True if successful.
 */
export async function copyToClipboard(text) {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    showToast("Failed to copy to clipboard", "error");
    return false;
  }
}

/**
 * Reads text from the clipboard.
 * @returns {Promise<string|null>} - The text from clipboard or null.
 */
export async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (err) {
    console.error("Failed to paste:", err);
    showToast(
      "Failed to read from clipboard. Ensure permissions are granted.",
      "error",
    );
    return null;
  }
}

/**
 * Displays or hides the error message.
 * @param {string|null} message - The error message to show, or null to hide.
 */
export function showError(message) {
  const display = document.getElementById("error-display");
  const messageEl = document.getElementById("error-message");

  if (!display || !messageEl) return;

  if (message) {
    messageEl.textContent = message;
    display.classList.remove("hidden");
  } else {
    display.classList.add("hidden");
  }
}
