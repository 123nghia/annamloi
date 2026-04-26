export function calculateDaysLeft(targetDate: string) {
  if (!targetDate) return null;

  const now = new Date();
  const target = new Date(`${targetDate}T23:59:59+07:00`);
  const diff = target.getTime() - now.getTime();

  if (Number.isNaN(target.getTime()) || diff <= 0) {
    return null;
  }

  return Math.ceil(diff / 86400000);
}

export function formatCurrencyVnd(value: number) {
  return new Intl.NumberFormat("vi-VN").format(Math.round(value));
}

export function slugifyName(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
