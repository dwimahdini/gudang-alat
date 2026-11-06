export type Status = "tersedia" | "dipinjam" | "perlu_dicek" | "rusak";

export type ItemAlat = {
  id: string;
  code: string;
  status: Status;
  loanId?: string;
  pemegang?: string;
  bagian?: string;
  sejak?: string;
  terakhirDipakai?: string;
  catatan?: string;
};

export function waktuRelatif(iso: string, now: number): string {
  const menit = Math.floor((now - new Date(iso).getTime()) / 60000);
  if (menit < 1) return "baru saja";
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  return `${Math.floor(jam / 24)} hari lalu`;
}

export const urutanStatus: Record<Status, number> = {
  perlu_dicek: 0,
  rusak: 1,
  dipinjam: 2,
  tersedia: 3,
};

export function formatTanggal(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  })
    .format(new Date(iso))
    .replace(",", "");
}