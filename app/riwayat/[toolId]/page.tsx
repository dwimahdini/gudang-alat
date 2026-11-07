import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatTanggal } from "@/lib/status";

type P = Promise<{ toolId: string }>;

type Pinjaman = {
  id: string;
  borrowed_at: string;
  returned_at: string | null;
  return_condition: string | null;
  note: string | null;
  recorded_by: string;
  technicians: { name: string; department: string } | null;
};

async function Isi({ params }: { params: P }) {
  const { toolId } = await params;

  const [{ data: alat }, { data, error }] = await Promise.all([
    supabase.from("tools").select("code, status").eq("id", toolId).single(),
    supabase
      .from("loans")
      .select(
        "id, borrowed_at, returned_at, return_condition, note, recorded_by, technicians(name, department)",
      )
      .eq("tool_id", toolId)
      .order("borrowed_at", { ascending: false }),
  ]);

  if (error) return <p className="text-xl">Gagal: {error.message}</p>;
  if (!alat)
    return (
      <p className="mt-5 rounded-xl border border-slate-300 bg-slate-50 p-5 text-lg text-slate-800">
        Alat tidak ditemukan.
      </p>
    );

  const riwayat = (data ?? []) as unknown as Pinjaman[];
  const terakhirRusak = riwayat.find((r) => r.return_condition === "rusak");

  return (
    <>
      <div className="mt-5 rounded-xl border border-slate-300 bg-slate-50 p-5 sm:p-6">
        <p className="text-lg font-semibold text-slate-700">Riwayat alat</p>
        <h2 className="mt-1 text-3xl font-bold text-slate-950">{alat.code}</h2>
      </div>

      {alat.status === "rusak" && (
        <div className="mt-3 rounded-xl border-l-8 border-red-700 bg-red-50 p-4 text-red-950 sm:p-5">
          <p className="text-xl font-bold sm:text-2xl">
            Alat ini berstatus rusak
          </p>
          <p className="mt-2 text-lg">
            {terakhirRusak
              ? `Dikembalikan dalam kondisi rusak oleh ${terakhirRusak.technicians?.name ?? "-"} pada ${
                  terakhirRusak.returned_at
                    ? formatTanggal(terakhirRusak.returned_at)
                    : "-"
                }.`
              : "Belum ada catatan pengembalian rusak."}
            {terakhirRusak?.note ? ` Catatan: ${terakhirRusak.note}` : ""}
          </p>
        </div>
      )}

      <h3 className="mt-7 text-2xl font-bold text-slate-950">
        Catatan peminjaman
      </h3>
      <div className="mt-3 space-y-3">
        {riwayat.length === 0 && (
          <p className="rounded-xl border border-slate-300 bg-slate-50 p-5 text-lg text-slate-800">
            Belum ada riwayat pemakaian.
          </p>
        )}
        {riwayat.map((r) => {
          const rusak = r.return_condition === "rusak";
          return (
            <div
              key={r.id}
              className={`rounded-xl border-l-8 p-4 sm:p-5 ${
                rusak
                  ? "border-red-700 bg-red-50 text-red-950"
                  : r.returned_at
                    ? "border-slate-500 bg-white text-slate-950"
                    : "border-blue-700 bg-blue-50 text-blue-950"
              }`}
            >
              <p className="text-xl font-bold sm:text-2xl">
                {r.technicians?.name ?? "-"}
                <span className="mt-1 block text-lg font-normal text-slate-700 sm:mt-0 sm:ml-2 sm:inline">
                  ({r.technicians?.department ?? "-"})
                </span>
              </p>
              <p className="mt-2 text-lg">
                Meminjam {formatTanggal(r.borrowed_at)}
                {r.returned_at
                  ? `, mengembalikan ${formatTanggal(r.returned_at)}`
                  : ", belum dikembalikan"}
              </p>
              {r.returned_at && (
                <p className="mt-1 text-lg font-semibold">
                  Kondisi: {rusak ? "Rusak" : "Baik"}
                </p>
              )}
              {r.note && <p className="mt-1 text-lg">Catatan: {r.note}</p>}
              <p className="mt-2 text-base text-slate-700">
                Dicatat oleh {r.recorded_by}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function Halaman({ params }: { params: P }) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 text-slate-950 sm:px-6 sm:py-5">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex min-h-14 items-center rounded-lg border-2 border-slate-400 bg-white px-4 py-2 text-lg font-semibold hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Kembali
        </Link>
        <section className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Riwayat pemakaian
          </h1>
          <Suspense
            fallback={
              <p className="mt-5 rounded-lg bg-slate-100 p-4 text-lg text-slate-800">
                Memuat riwayat...
              </p>
            }
          >
            <Isi params={params} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
