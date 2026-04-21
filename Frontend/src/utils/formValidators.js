export function required(value, fieldName = "This field") {
  if (!value || (typeof value === "string" && !value.trim())) {
    return `${fieldName} is required.`;
  }
  return null;
}

export function email(value) {
  if (!value) return null;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value) ? null : "Please enter a valid email address.";
}

export function minLength(value, min, fieldName = "This field") {
  if (!value) return null;
  return value.length >= min ? null : `${fieldName} must be at least ${min} characters.`;
}

export function passwordsMatch(pw, confirm) {
  return pw === confirm ? null : "Passwords do not match.";
}
