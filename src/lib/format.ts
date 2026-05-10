export function formatRupiah(n: number | string | null | undefined): string {
  const num = Number(n ?? 0);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function genTrxCode(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  const rnd = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `TRX-${stamp}-${rnd}`;
}