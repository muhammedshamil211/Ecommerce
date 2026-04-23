export function formatDate(iso) {

  if (!iso) return "-";

  const d = new Date(iso);

  if (isNaN(d.getTime())) return "-";

  return d.toISOString().split("T")[0];
}