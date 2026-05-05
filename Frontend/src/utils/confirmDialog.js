/**
 * Enhanced confirmation dialog utility
 * Provides a consistent way to confirm destructive actions
 */

export function confirmDelete(itemName, callback) {
  return confirmAction(
    `Delete "${itemName}"`,
    `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    callback
  );
}

export function confirmAction(title, message, callback) {
  const confirmed = window.confirm(message);
  if (confirmed && callback) {
    callback();
  }
  return confirmed;
}

export function showConfirmDialog(options = {}) {
  const {
    title = "Confirm Action",
    message = "Are you sure?",
    okText = "Yes",
    cancelText = "Cancel",
    isDangerous = false,
  } = options;

  // For now, using simple window.confirm (can be replaced with modal later)
  const style = isDangerous ? "(This action cannot be undone)" : "";
  const fullMessage = `${message}\n\n${style}`.trim();
  return window.confirm(fullMessage);
}

