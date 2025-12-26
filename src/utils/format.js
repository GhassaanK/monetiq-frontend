export function fmtCurrency(n) {
  const num = Number(n) || 0;
  return `PKR ${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function fmtDate(d) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString();
}

export default { fmtCurrency, fmtDate };
