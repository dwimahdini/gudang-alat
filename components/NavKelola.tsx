import Link from "next/link";

export default function NavKelola({ aktif }: { aktif: "teknisi" | "alat" }) {
  const gaya = (a: boolean) =>
    `inline-flex min-h-12 items-center justify-center rounded-lg border-2 px-4 py-2 text-lg font-semibold focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:px-5 ${
      a
        ? "border-slate-900 bg-slate-900 text-white"
        : "border-slate-400 bg-white text-slate-950 hover:bg-slate-100"
    }`;
  return (
    <nav aria-label="Kelola data" className="mt-4 flex flex-wrap gap-2 sm:gap-3">
      <Link href="/kelola/teknisi" className={gaya(aktif === "teknisi")}>
        Teknisi
      </Link>
      <Link href="/kelola/alat" className={gaya(aktif === "alat")}>
        Alat
      </Link>
    </nav>
  );
}
