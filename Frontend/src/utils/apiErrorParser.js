export function parseApiError(err) {
  if (err.response) {
    const data = err.response.data;

    if (typeof data === "string") {
      try {
        // Extract JSON part (between first [ and last ])
        
        const startIndex = data.indexOf('[{');
            const endIndex = data.lastIndexOf('}]') + 2;

            if (startIndex !== -1 && endIndex !== -1) {
              const jsonString = data.substring(startIndex, endIndex);
              const parsed = JSON.parse(jsonString);

              return parsed[0]?.message || data;
            }

      } catch (e) {
        // fallback if parsing fails
      }

      return data;
    }

    return data?.message || data?.error || `Error ${err.response.status}`;
  }

  if (err.request) {
    return "Network error — server may be unreachable.";
  }

  return err.message || "An unexpected error occurred.";
}