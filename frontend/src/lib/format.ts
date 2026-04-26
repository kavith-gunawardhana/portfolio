export function formatMonthYear(d: string | null | undefined): string {
  if (!d) return "Present";
  // Expecting YYYY-MM-DD
  const [y, m] = d.split("-");
  if (!y) return d;
  const month = m ? new Date(0, parseInt(m, 10) - 1).toLocaleString("en-US", { month: "short" }) : "";
  return month ? `${month} ${y}` : y;
}

export function parseTags(tagsJson: string): string[] {
  try {
    const v = JSON.parse(tagsJson);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function parseStringArray(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
