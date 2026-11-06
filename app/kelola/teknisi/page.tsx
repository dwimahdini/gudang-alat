import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import NavKelola from "@/components/NavKelola";
import { FormTeknisi } from "@/components/FormTambah";
import TombolAksi from "@/components/TombolAksi";

async function Daftar() {
  const { data, error } = await supabase
    .from("technicians")
    .select("id, name, department, active")
    .order("name");

  if (error) return <p className="text-xl">Gagal: {error.message}</p>;

  const aktif = (data ?? []).filter((t) => t.active);
  const nonaktif = (data ?? []).filter((t) => !t.active);

  return (
    <>
      <h2 className="mt-8 text-2xl font-bold text-slate-950">
        Teknisi aktif ({aktif.length})
      </h2>
      <div className="mt-3 space-y-3">
        {aktif.map((t) => (
          <div
            key={t.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
          >
            <p className="text-xl font-bold text-slate-950 sm:text-2xl">
              {t.name}
              <span className="mt-1 block text-lg font-normal text-slate-700 sm:mt-0 sm:ml-2 sm:inline">
                ({t.department})
              </span>
            </p>
            <TombolAksi
              tabel="technicians"
              id={t.id}
              aksi="nonaktifkan"
              teks="Nonaktifkan"
              kelas="border-2 border-slate-400 bg-white text-slate-950 hover:bg-slate-100"
              konfirmasi={`Nonaktifkan ${t.name}? Riwayat lama tetap tersimpan.`}
            />
          </div>
        ))}
      </div>

      {nonaktif.length > 0 && (
        <>
          <h2 className="mt-8 text-2xl font-bold text-slate-950">
            Tidak aktif ({nonaktif.length})
          </h2>
          <div className="mt-3 space-y-3">
            {nonaktif.map((t) => (
              <div
                key={t.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <p className="text-lg text-slate-800">
                  {t.name} ({t.department})
                </p>
                <TombolAksi
                  tabel="technicians"
                  id={t.id}
                  aksi="aktifkan"
                  teks="Aktifkan kembali"
                  kelas="bg-blue-700 text-white hover:bg-blue-800"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default function Halaman() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/kelola"
          className="inline-flex min-h-12 items-center rounded-lg border-2 border-slate-400 bg-white px-4 py-2 text-lg font-semibold hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          ← Kembali ke Kelola Data
        </Link>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Kelola teknisi
          </h1>
          <NavKelola aktif="teknisi" />
          <div className="mt-6">
            <FormTeknisi />
          </div>
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
