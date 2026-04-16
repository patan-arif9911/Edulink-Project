export function parseApiError(err) {
  if (err.response) {
    const data = err.response.data;
    if (typeof data === "string") return data;
    return data?.message || data?.error || `Error ${err.response.status}`;
  }
  if (err.request) {
    return "Network error — server may be unreachable.";
  }
  return err.message || "An unexpected error occurred.";
}
