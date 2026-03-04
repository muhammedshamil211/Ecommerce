export function formatDate(iso) {
  const d = new Date(iso)
  return d.toISOString().split("T")[0];
}

export default {
  formatDate
}
