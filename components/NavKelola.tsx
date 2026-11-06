import Link from "next/link";

export default function NavKelola({ aktif }: { aktif: "teknisi" | "alat" }) {
  const gaya = (a: boolean) =>
    `px-6 py-3 rounded-lg text-xl border-2 ${
      a ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-400"
    }`;
  return (
    <div className="flex gap-3 mt-4">
      <Link href="/kelola/teknisi" className={gaya(aktif === "teknisi")}>
        Daftar Teknisi
      </Link>
      <Link href="/kelola/alat" className={gaya(aktif === "alat")}>
        Daftar Alat
      </Link>
    </div>
  );
}
