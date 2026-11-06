import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DaftarAlat from "@/components/DaftarAlat";
import PopupHasil from "@/components/PopupHasil";
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
      "id, name, code, status, loans(id, borrowed_at, due_at, returned_at, return_condition, note, technicians(name, department))",
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
      name: t.name,
      code: t.code,
      status,
      loanId: aktif?.id,
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
    <main className="min-h-screen w-full bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">
          <p className="text-lg font-semibold text-slate-200">Pos Gudang</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Peminjaman Alat Gudang
          </h1>
          <Suspense fallback={null}>
            <PopupHasil />
          </Suspense>
          <p className="mt-3 text-lg text-slate-200">
            Lihat alat yang tersedia, sedang dipinjam, atau perlu dicek.
          </p>
        </header>

        <nav
          aria-label="Menu utama"
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Link
            href="/pinjam"
            className="flex min-h-20 items-center justify-center rounded-xl bg-green-700 px-6 py-5 text-center text-xl font-bold text-white shadow-sm transition-colors hover:bg-green-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:text-2xl"
          >
            + Pinjamkan alat
          </Link>
          <Link
            href="/kembali"
            className="flex min-h-20 items-center justify-center rounded-xl bg-blue-700 px-6 py-5 text-center text-xl font-bold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:text-2xl"
          >
            ↩ Terima kembali
          </Link>
          <Link
            href="/kelola"
            className="flex min-h-20 items-center justify-center rounded-xl border-2 border-slate-400 bg-white px-6 py-5 text-center text-xl font-bold text-slate-950 shadow-sm hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-700 sm:col-span-2 sm:text-2xl lg:col-span-1"
          >
            ⚙ Kelola data
          </Link>
        </nav>

        <section
          aria-labelledby="daftar-alat"
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <h2 id="daftar-alat" className="text-2xl font-bold sm:text-3xl">
            Daftar alat
          </h2>
          <p className="mt-1 text-lg text-slate-700">
            Pilih alat untuk melihat riwayat atau mencatat pengembaliannya.
          </p>
          <Suspense
            fallback={
              <p className="mt-5 rounded-lg bg-slate-100 p-4 text-lg text-slate-800">
                Memuat daftar alat...
              </p>
            }
          >
            <Konten />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
