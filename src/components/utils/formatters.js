/**
 * Format a string by replacing underscores with spaces
 * Used for displaying technical field values in a user-friendly way
 * @param {string} str - The string to format
 * @returns {string} The formatted string
 */
export function formatFieldValue(str) {
  return str.replace(/_/g, ' ');
}

/**
 * Format an array of strings by replacing underscores and joining with commas
 * @param {string[]} arr - Array of strings to format
 * @returns {string} Comma-separated formatted string
 */
export function formatFieldArray(arr) {
  return arr.map(formatFieldValue).join(', ');
}
