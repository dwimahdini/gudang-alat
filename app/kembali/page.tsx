import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { waktuRelatif } from "@/lib/status";

type Baris = {
  id: string;
  borrowed_at: string;
  tools: { code: string } | null;
  technicians: { name: string; department: string } | null;
};

async function Daftar() {
  const { data, error } = await supabase
    .from("loans")
    .select("id, borrowed_at, tools(code), technicians(name, department)")
    .is("returned_at", null)
    .order("borrowed_at");

  if (error) return <p className="text-xl">Gagal: {error.message}</p>;

  const baris = (data ?? []) as unknown as Baris[];
  const now = Date.now();

  if (baris.length === 0)
    return (
      <p className="mt-5 rounded-xl border border-slate-300 bg-slate-50 p-5 text-lg text-slate-800">
        Tidak ada alat yang sedang dipinjam.
      </p>
    );

  return (
    <div className="mt-5 space-y-3">
      {baris.map((b) => (
        <Link
          key={b.id}
          href={`/kembali/${b.id}`}
          className="block rounded-xl border-2 border-blue-600 bg-blue-50 p-4 shadow-sm hover:bg-blue-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:p-5"
        >
          <p className="text-2xl font-bold text-blue-950">{b.tools?.code}</p>
          <p className="mt-1 text-lg text-slate-900 sm:text-xl">
            Dipegang {b.technicians?.name} ({b.technicians?.department}) sejak{" "}
            {waktuRelatif(b.borrowed_at, now)}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default function Halaman() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-lg border-2 border-slate-400 bg-white px-4 py-2 text-lg font-semibold hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          ← Kembali
        </Link>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Terima kembali
          </h1>
          <p className="mt-2 text-xl text-slate-800">
            Pilih alat yang dikembalikan.
          </p>
          <Suspense
            fallback={
              <p className="mt-5 rounded-lg bg-slate-100 p-4 text-lg text-slate-800">
                Memuat daftar peminjaman...
              </p>
            }
          >
            <Daftar />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
