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
      <h2 className="text-2xl font-bold mt-8">
        Teknisi aktif ({aktif.length})
      </h2>
      <div className="space-y-3 mt-3">
        {aktif.map((t) => (
          <div
            key={t.id}
            className="flex flex-wrap items-start justify-between gap-3 border-2 border-gray-300 rounded-lg p-4"
          >
            <p className="text-2xl font-bold">
              {t.name}{" "}
              <span className="text-lg font-normal text-gray-600">
                ({t.department})
              </span>
            </p>
            <TombolAksi
              tabel="technicians"
              id={t.id}
              aksi="nonaktifkan"
              teks="Nonaktifkan"
              kelas="border-2 border-gray-500 bg-white"
              konfirmasi={`Nonaktifkan ${t.name}? Riwayat lama tetap tersimpan.`}
            />
          </div>
        ))}
      </div>

      {nonaktif.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-8">
            Tidak aktif ({nonaktif.length})
          </h2>
          <div className="space-y-3 mt-3">
            {nonaktif.map((t) => (
              <div
                key={t.id}
                className="flex flex-wrap items-start justify-between gap-3 border-2 border-gray-200 bg-gray-50 rounded-lg p-4"
              >
                <p className="text-xl text-gray-600">
                  {t.name} ({t.department})
                </p>
                <TombolAksi
                  tabel="technicians"
                  id={t.id}
                  aksi="aktifkan"
                  teks="Aktifkan kembali"
                  kelas="bg-blue-700 text-white"
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
    <main className="p-6 max-w-3xl mx-auto">
      <Link href="/" className="text-xl underline">
        ← Kembali ke Beranda
      </Link>
      <h1 className="text-4xl font-bold mt-4">Kelola Data</h1>
      <NavKelola aktif="teknisi" />
      <div className="mt-6">
        <FormTeknisi />
      </div>
      <Suspense fallback={<p className="mt-4 text-xl">Memuat...</p>}>
        <Daftar />
      </Suspense>
    </main>
  );
}
