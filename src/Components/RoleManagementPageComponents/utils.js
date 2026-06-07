// Capitalises the first letter of every word.
// e.g. "home manager" → "Home Manager"
export const titleize = (value = "") =>
  value.replace(/\b\w/g, (char) => char.toUpperCase());
