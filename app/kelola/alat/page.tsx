import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import NavKelola from "@/components/NavKelola";
import { FormAlat } from "@/components/FormTambah";
import TombolAksi from "@/components/TombolAksi";

async function Daftar() {
  const { data, error } = await supabase
    .from("tools")
    .select("id, name, code, status, active, loans(returned_at)")
    .order("code");

  if (error) return <p className="text-xl">Gagal: {error.message}</p>;

  type UnitAlat = {
    id: string;
    name: string;
    code: string;
    status: string;
    active: boolean;
    loans: { returned_at: string | null }[];
  };
  const alat = (data ?? []) as unknown as UnitAlat[];
  const aktif = alat.filter((t) => t.active);
  const nonaktif = alat.filter((t) => !t.active);
  const kelompokkan = (unit: UnitAlat[]) =>
    Object.values(
      unit.reduce<Record<string, UnitAlat[]>>((kelompok, item) => {
        const kunci = item.name.trim().toLowerCase();
        (kelompok[kunci] ??= []).push(item);
        return kelompok;
      }, {}),
    ).sort((a, b) => a[0].name.localeCompare(b[0].name, "id"));
  const jenisAktif = kelompokkan(aktif);
  const jenisNonaktif = kelompokkan(nonaktif);

  return (
    <>
      <h2 className="mt-8 text-2xl font-bold text-slate-950">
        Alat aktif ({aktif.length})
      </h2>
      <div className="mt-3 space-y-2">
        {jenisAktif.map((jenis) => {
          const tersedia = jenis.filter(
            (t) =>
              t.status !== "rusak" &&
              !t.loans.some((loan) => loan.returned_at === null),
          ).length;
          const dipinjam = jenis.filter(
            (t) =>
              t.status !== "rusak" &&
              t.loans.some((loan) => loan.returned_at === null),
          ).length;
          const rusak = jenis.filter((t) => t.status === "rusak").length;

          return (
            <details
              key={jenis[0].name.trim().toLowerCase()}
              className="overflow-hidden rounded-lg border border-slate-300 bg-white"
            >
              <summary className="flex min-h-16 cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
                <span>
                  <span className="block text-xl font-bold text-slate-950">
                    {jenis[0].name.trim()}
                  </span>
                  <span className="mt-1 block text-base text-slate-800">
                    Total {jenis.length} • Tersedia {tersedia} • Dipinjam{" "}
                    {dipinjam} • Rusak {rusak}
                  </span>
                </span>
                <span className="inline-flex min-h-14 items-center justify-center rounded-lg border-2 border-slate-400 bg-white px-4 py-2 text-lg font-semibold text-slate-950">
                  Lihat unit
                </span>
              </summary>
              <div className="border-t border-slate-300">
                {jenis.map((t) => {
                  const sedangDipinjam = t.loans.some(
                    (loan) => loan.returned_at === null,
                  );
                  const status =
                    t.status === "rusak"
                      ? "Rusak"
                      : sedangDipinjam
                        ? "Dipinjam"
                        : "Tersedia";
                  const warnaStatus =
                    status === "Rusak"
                      ? "bg-red-700 text-white"
                      : status === "Dipinjam"
                        ? "bg-blue-700 text-white"
                        : "bg-green-700 text-white";

                  return (
                    <div
                      key={t.id}
                      className="flex flex-col gap-2 border-b border-slate-200 px-3 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-lg font-semibold text-slate-950">
                          {t.code}
                        </span>
                        <span
                          className={`inline-flex min-h-8 items-center rounded-md px-3 py-1 text-base font-semibold ${warnaStatus}`}
                        >
                          {status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {t.status === "rusak" && (
                          <TombolAksi
                            tabel="tools"
                            id={t.id}
                            aksi="pulihkan"
                            teks="Pulihkan jadi Tersedia"
                            kelas="bg-green-700 text-white hover:bg-green-800"
                            konfirmasi={`Alat ${t.code} sudah diperbaiki dan siap dipinjam lagi?`}
                          />
                        )}
                        <TombolAksi
                          tabel="tools"
                          id={t.id}
                          aksi="nonaktifkan"
                          teks="Nonaktifkan"
                          kelas="border-2 border-slate-400 bg-white text-slate-950 hover:bg-slate-100"
                          konfirmasi={`Nonaktifkan ${t.code}? Riwayat lama tetap tersimpan.`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>

      {nonaktif.length > 0 && (
        <>
          <h2 className="mt-8 text-2xl font-bold text-slate-950">
            Tidak aktif ({nonaktif.length})
          </h2>
          <div className="mt-3 space-y-2">
            {jenisNonaktif.map((jenis) => (
              <details
                key={jenis[0].name.trim().toLowerCase()}
                className="overflow-hidden rounded-lg border border-slate-300 bg-white"
              >
                <summary className="flex min-h-16 cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
                  <span>
                    <span className="block text-xl font-bold text-slate-950">
                      {jenis[0].name.trim()}
                    </span>
                    <span className="mt-1 block text-base text-slate-800">
                      Total {jenis.length} • Tidak aktif
                    </span>
                  </span>
                  <span className="inline-flex min-h-14 items-center justify-center rounded-lg border-2 border-slate-400 bg-white px-4 py-2 text-lg font-semibold text-slate-950">
                    Lihat unit
                  </span>
                </summary>
                <div className="border-t border-slate-300">
                  {jenis.map((t) => (
                    <div
                      key={t.id}
                      className="flex flex-col gap-2 border-b border-slate-200 px-3 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-lg font-semibold text-slate-950">
                        {t.code}
                      </span>
                      <TombolAksi
                        tabel="tools"
                        id={t.id}
                        aksi="aktifkan"
                        teks="Aktifkan kembali"
                        kelas="bg-blue-700 text-white hover:bg-blue-800"
                      />
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default function Halaman() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 text-slate-950 sm:px-6 sm:py-5">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/kelola"
          className="inline-flex min-h-14 items-center rounded-lg border-2 border-slate-400 bg-white px-4 py-2 text-lg font-semibold hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          ← Kembali ke Kelola Data
        </Link>
        <section className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Kelola alat
          </h1>
          <NavKelola aktif="alat" />
          <div className="mt-4">
            <FormAlat />
          </div>
          <Suspense
            fallback={
              <p className="mt-5 rounded-lg bg-slate-100 p-4 text-lg text-slate-800">
                Memuat daftar alat...
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
