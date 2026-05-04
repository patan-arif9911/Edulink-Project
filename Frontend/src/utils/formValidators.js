/* ═══════════════════ BASIC VALIDATORS ═══════════════════ */

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

export function maxLength(value, max, fieldName = "This field") {
  if (!value) return null;
  return value.length <= max ? null : `${fieldName} must be at most ${max} characters.`;
}

export function passwordsMatch(pw, confirm) {
  return pw === confirm ? null : "Passwords do not match.";
}

/* ═══════════════════ ADVANCED VALIDATORS ═══════════════════ */

export function password(value, fieldName = "Password") {
  if (!value) return `${fieldName} is required.`;
  if (value.length < 8) return `${fieldName} must be at least 8 characters.`;
  if (!/[A-Z]/.test(value)) return `${fieldName} must contain at least one uppercase letter.`;
  if (!/[a-z]/.test(value)) return `${fieldName} must contain at least one lowercase letter.`;
  if (!/[0-9]/.test(value)) return `${fieldName} must contain at least one number.`;
  return null;
}

export function url(value) {
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch {
    return "Please enter a valid URL.";
  }
}

export function phone(value) {
  if (!value) return null;
  const re = /^[\d\s\-\(\)\+]+$/;
  return re.test(value) && value.replace(/\D/g, "").length >= 10
    ? null
    : "Please enter a valid phone number.";
}

export function number(value, min = null, max = null) {
  if (!value) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return "Please enter a valid number.";
  if (min !== null && num < min) return `Value must be at least ${min}.`;
  if (max !== null && num > max) return `Value must be at most ${max}.`;
  return null;
}

/* ═══════════════════ COMBINED VALIDATORS ═══════════════════ */

/**
 * Validate entire form object
 * @param {Object} values - Form values
 * @param {Object} rules - Validation rules { fieldName: [(value) => error || null] }
 * @returns {Object} Errors object
 */
export function validateForm(values, rules) {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const validators = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    for (const validator of validators) {
      const error = validator(values[field]);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });

  return errors;
}

/**
 * Check if form has any errors
 */
export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

