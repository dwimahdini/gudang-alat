import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import NavKelola from "@/components/NavKelola";
import { FormAlat } from "@/components/FormTambah";
import TombolAksi from "@/components/TombolAksi";

async function Daftar() {
  const { data, error } = await supabase
    .from("tools")
    .select("id, code, status, active")
    .order("code");

  if (error) return <p className="text-xl">Gagal: {error.message}</p>;

  const aktif = (data ?? []).filter((t) => t.active);
  const nonaktif = (data ?? []).filter((t) => !t.active);

  return (
    <>
      <h2 className="text-2xl font-bold mt-8">Alat aktif ({aktif.length})</h2>
      <div className="space-y-3 mt-3">
        {aktif.map((t) => (
          <div
            key={t.id}
            className="flex flex-wrap items-start justify-between gap-3 border-2 border-gray-300 rounded-lg p-4"
          >
            <p className="text-2xl font-bold">
              {t.code}{" "}
              {t.status === "rusak" && (
                <span className="text-lg font-semibold text-red-700">
                  🔴 RUSAK
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              {t.status === "rusak" && (
                <TombolAksi
                  tabel="tools"
                  id={t.id}
                  aksi="pulihkan"
                  teks="Pulihkan jadi Tersedia"
                  kelas="bg-green-700 text-white"
                  konfirmasi={`Alat ${t.code} sudah diperbaiki dan siap dipinjam lagi?`}
                />
              )}
              <TombolAksi
                tabel="tools"
                id={t.id}
                aksi="nonaktifkan"
                teks="Nonaktifkan"
                kelas="border-2 border-gray-500 bg-white"
                konfirmasi={`Nonaktifkan ${t.code}? Riwayat lama tetap tersimpan.`}
              />
            </div>
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
                <p className="text-xl text-gray-600">{t.code}</p>
                <TombolAksi
                  tabel="tools"
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
      <NavKelola aktif="alat" />
      <div className="mt-6">
        <FormAlat />
      </div>
      <Suspense fallback={<p className="mt-4 text-xl">Memuat...</p>}>
        <Daftar />
      </Suspense>
    </main>
  );
}
