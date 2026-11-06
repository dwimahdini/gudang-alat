import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DaftarAlat from "@/components/DaftarAlat";
import { ItemAlat, Status, urutanStatus, waktuRelatif } from "@/lib/status";

type Pinjaman = {
  id: string;
  borrowed_at: string;
  due_at: string;
  returned_at: string | null;
  return_condition: string | null;
  note: string | null;
  technicians: { name: string; department: string } | null;
};

async function Konten() {
  const { data, error } = await supabase
    .from("tools")
    .select(
      "id, code, status, loans(id, borrowed_at, due_at, returned_at, return_condition, note, technicians(name, department))",
    )
    .eq("active", true);

  if (error) return <p className="text-xl">Gagal: {error.message}</p>;

  const now = Date.now();

  const items: ItemAlat[] = (data ?? []).map((t) => {
    const loans = ((t.loans ?? []) as unknown as Pinjaman[]).sort(
      (a, b) => +new Date(b.borrowed_at) - +new Date(a.borrowed_at),
    );
    const aktif = loans.find((l) => l.returned_at === null);

    let status: Status = "tersedia";
    if (t.status === "rusak") status = "rusak";
    else if (aktif)
      status = +new Date(aktif.due_at) < now ? "perlu_dicek" : "dipinjam";

    return {
      id: t.id,
      code: t.code,
      status,
      loadId: aktif?.id,
      pemegang: aktif?.technicians?.name,
      bagian: aktif?.technicians?.department,
      sejak: aktif ? waktuRelatif(aktif.borrowed_at, now) : undefined,
      terakhirDipakai: loans[0]?.technicians?.name,
      catatan:
        loans.find((l) => l.return_condition === "rusak")?.note ?? undefined,
    };
  });

  items.sort(
    (a, b) =>
      urutanStatus[a.status] - urutanStatus[b.status] ||
      a.code.localeCompare(b.code),
  );

  return <DaftarAlat items={items} />;
}

export default function Beranda() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold">Peminjaman Alat Gudang</h1>

      <div className="flex flex-wrap gap-4 mt-6">
        <Link
          href="/pinjam"
          className="px-8 py-5 rounded-lg bg-green-700 text-white text-2xl font-bold"
        >
          + PINJAMKAN ALAT
        </Link>
        <Link
          href="/kembali"
          className="px-8 py-5 rounded-lg bg-blue-700 text-white text-2xl font-bold"
        >
          ↩ TERIMA KEMBALI
        </Link>
        <Link
          href="/kelola"
          className="px-8 py-5 rounded-lg border-2 border-gray-500 bg-white text-2xl font-bold"
        >
          ⚙ KELOLA DATA
        </Link>
      </div>

      <Suspense
        fallback={<p className="mt-4 text-xl">Memuat daftar alat...</p>}
      >
        <Konten />
      </Suspense>
    </main>
  );
}
