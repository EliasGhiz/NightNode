export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number | null, currency = "USD") {
  if (amount === null || Number.isNaN(amount)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUpdatedAt(date: string) {
  const time = new Date(date);
  if (Number.isNaN(time.getTime())) return "just now";
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round((time.getTime() - Date.now()) / (1000 * 60)),
    "minute",
  );
}
