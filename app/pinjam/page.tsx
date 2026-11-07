import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function Daftar() {
  const { data, error } = await supabase
    .from("technicians")
    .select("id, name, department")
    .eq("active", true)
    .order("name");

  if (error) return <p className="text-xl">Gagal: {error.message}</p>;

  return (
    <div     className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {data?.map((t) => (
        <Link
          key={t.id}
          href={`/pinjam/${t.id}`}
          className="flex min-h-24 flex-col justify-center rounded-lg border-2 border-slate-300 bg-white p-4 shadow-sm hover:border-slate-500 hover:bg-slate-50 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          <p className="text-left text-xl font-bold text-slate-950 sm:text-2xl">
            {t.name}
          </p>
          <p className="mt-1 text-left text-lg text-slate-700">
            {t.department}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default function Halaman() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 text-slate-950 sm:px-6 sm:py-5">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex min-h-14 items-center rounded-lg border-2 border-slate-400 bg-white px-4 py-2 text-lg font-semibold text-slate-950 hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Kembali
        </Link>
        <section className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-lg font-semibold text-slate-700">
            Langkah 1 dari 2
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Pinjamkan alat
          </h1>
          <p className="mt-2 text-xl text-slate-800">
            Pilih teknisi yang meminjam.
          </p>
          <Suspense
            fallback={
              <p className="mt-5 rounded-lg bg-slate-100 p-4 text-lg text-slate-800">
                Memuat daftar teknisi...
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
