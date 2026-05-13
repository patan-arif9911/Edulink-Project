/* Shared ascending sort helpers used by dropdowns / tables across the app. */

/**
 * Sort classes by grade (numeric) then section (alphabetic).
 * Example order: 1A, 1B, 5A, 10A, 10B, 10C, 11A.
 */
export function sortClasses(classes = []) {
  return [...classes].sort((a, b) => {
    const ga = Number(a?.grade ?? 0);
    const gb = Number(b?.grade ?? 0);
    if (ga !== gb) return ga - gb;
    return String(a?.section ?? "").localeCompare(String(b?.section ?? ""), undefined, { sensitivity: "base" });
  });
}

/**
 * Sort by display name (fullName / name / email fallback), case-insensitive.
 * Useful for teacher and student dropdowns.
 */
export function sortByName(people = []) {
  return [...people].sort((a, b) => {
    const an = (a?.fullName || a?.name || a?.email || "").toString();
    const bn = (b?.fullName || b?.name || b?.email || "").toString();
    return an.localeCompare(bn, undefined, { sensitivity: "base" });
  });
}

/**
 * Sort by an arbitrary string field, case-insensitive.
 * Example: sortByField(courses, "courseCode")
 */
export function sortByField(items = [], field = "") {
  return [...items].sort((a, b) =>
    String(a?.[field] ?? "").localeCompare(String(b?.[field] ?? ""), undefined, { sensitivity: "base" })
  );
}
