"use client";

import { useState } from "react";
import Link from "next/link";
import type { ItemAlat, Status } from "@/lib/status";

const label: Record<Status, { teks: string; kelas: string }> = {
  perlu_dicek: {
    teks: "Perlu dicek",
    kelas: "border-yellow-600 bg-yellow-50 text-yellow-950",
  },
  rusak: {
    teks: "Rusak",
    kelas: "border-red-600 bg-red-50 text-red-950",
  },
  dipinjam: {
    teks: "Dipinjam",
    kelas: "border-blue-600 bg-blue-50 text-blue-950",
  },
  tersedia: {
    teks: "Tersedia",
    kelas: "border-green-600 bg-green-50 text-green-950",
  },
};

type Filter = "semua" | "dipinjam" | "perlu_dicek" | "rusak";

export default function DaftarAlat({ items }: { items: ItemAlat[] }) {
  const [filter, setFilter] = useState<Filter>("semua");
  const [cari, setCari] = useState("");
  const [terbuka, setTerbuka] = useState<string | null>(null);

  const hitung = (s: Status) => items.filter((i) => i.status === s).length;
  const jumlahDipinjam = hitung("dipinjam") + hitung("perlu_dicek");

  const kelompok = Object.values(
    items.reduce<Record<string, ItemAlat[]>>((hasil, item) => {
      const kunci = item.name.trim().toLowerCase();
      (hasil[kunci] ??= []).push(item);
      return hasil;
    }, {}),
  )
    .map((unit) => {
      const cocokFilter = (item: ItemAlat) =>
        filter === "semua" ||
        (filter === "dipinjam"
          ? item.status === "dipinjam" || item.status === "perlu_dicek"
          : item.status === filter);
      const cocokCari = cari.trim().toLowerCase();
      const cocokNama = unit[0].name.toLowerCase().includes(cocokCari);
      const unitTampil = unit.filter(
        (item) =>
          cocokFilter(item) &&
          (!cocokCari || cocokNama || item.code.toLowerCase().includes(cocokCari)),
      );
      const perluDicek = unit.some((item) => item.status === "perlu_dicek");
      const rusak = unit.some((item) => item.status === "rusak");

      return {
        nama: unit[0].name,
        unit,
        unitTampil,
        perluDicek,
        rusak,
        prioritas: perluDicek ? 0 : rusak ? 1 : 2,
      };
    })
    .filter((jenis) => jenis.unitTampil.length > 0)
    .sort(
      (a, b) =>
        a.prioritas - b.prioritas || a.nama.localeCompare(b.nama, "id"),
    );

  const tombol: { nilai: Filter; teks: string }[] = [
    { nilai: "semua", teks: "Semua" },
    { nilai: "dipinjam", teks: "Sedang dipinjam" },
    { nilai: "perlu_dicek", teks: "Perlu dicek" },
    { nilai: "rusak", teks: "Rusak" },
  ];

  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-300 border-l-4 border-l-blue-600 bg-white p-3">
          <p className="text-lg font-semibold text-blue-950">Dipinjam</p>
          <p className="mt-1 text-3xl font-bold text-blue-950">
            {jumlahDipinjam}
          </p>
          <p className="mt-1 text-base text-slate-800">Unit yang masih dipinjam</p>
        </div>
        <div className="rounded-lg border border-slate-300 border-l-4 border-l-yellow-600 bg-white p-3">
          <p className="text-lg font-semibold text-yellow-950">Perlu dicek</p>
          <p className="mt-1 text-3xl font-bold text-yellow-950">
            {hitung("perlu_dicek")}
          </p>
          <p className="mt-1 text-base text-slate-800">Melewati batas kembali</p>
        </div>
        <div className="rounded-lg border border-slate-300 border-l-4 border-l-red-600 bg-white p-3">
          <p className="text-lg font-semibold text-red-950">Rusak</p>
          <p className="mt-1 text-3xl font-bold text-red-950">
            {hitung("rusak")}
          </p>
          <p className="mt-1 text-base text-slate-800">Tidak siap dipinjam</p>
        </div>
        <div className="rounded-lg border border-slate-300 border-l-4 border-l-green-600 bg-white p-3">
          <p className="text-lg font-semibold text-green-950">Tersedia</p>
          <p className="mt-1 text-3xl font-bold text-green-950">
            {hitung("tersedia")}
          </p>
          <p className="mt-1 text-base text-slate-800">Siap dipinjam</p>
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="cari-alat"
          className="mb-2 block text-lg font-semibold text-slate-900"
        >
          Cari jenis atau kode alat
        </label>
        <input
          id="cari-alat"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder=""
          className="w-full rounded-lg border-2 border-slate-400 bg-white p-3 text-lg text-slate-950 placeholder:text-slate-600 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        />
      </div>

      <div className="my-3 flex flex-wrap gap-2">
        {tombol.map((t) => (
          <button
            key={t.nilai}
            onClick={() => setFilter(t.nilai)}
            className={`min-h-14 rounded-lg border-2 px-4 py-2 text-lg font-semibold focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:px-5 ${
              filter === t.nilai
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-400 bg-white text-slate-950 hover:bg-slate-100"
            }`}
          >
            {t.teks}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {kelompok.length === 0 && (
          <p className="rounded-xl border border-slate-300 bg-slate-50 p-5 text-lg text-slate-800">
            Tidak ada alat yang cocok.
          </p>
        )}
        {kelompok.map((jenis) => {
          const jumlahAktif = jenis.unit.filter(
            (item) =>
              item.status === "dipinjam" || item.status === "perlu_dicek",
          ).length;
          const jumlahTersedia = jenis.unit.filter(
            (item) => item.status === "tersedia",
          ).length;
          const isTerbuka = terbuka === jenis.nama.toLowerCase();
          const idRincian = `rincian-${jenis.unit[0].id}`;

          return (
            <section
              key={jenis.nama.toLowerCase()}
              className="overflow-hidden rounded-xl border-2 border-slate-300 bg-white"
            >
              <button
                type="button"
                aria-expanded={isTerbuka}
                aria-controls={idRincian}
                onClick={() =>
                  setTerbuka(isTerbuka ? null : jenis.nama.toLowerCase())
                }
                className="flex min-h-16 w-full flex-wrap items-center justify-between gap-3 p-3 text-left hover:bg-slate-50 focus-visible:outline-4 focus-visible:outline-inset focus-visible:outline-blue-700 sm:p-4"
              >
                <span>
                  <span className="block text-xl font-bold text-slate-950 sm:text-2xl">
                    {jenis.nama}
                  </span>
                  <span className="mt-1 block text-lg font-normal text-slate-700">
                    {isTerbuka
                      ? "Tekan untuk menutup rincian alat."
                      : "Tekan untuk melihat jumlah, status, dan rincian alat."}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-2xl font-bold text-slate-950"
                >
                  {isTerbuka ? "−" : "+"}
                </span>
              </button>
              <div
                id={idRincian}
                hidden={!isTerbuka}
                className="space-y-3 border-t border-slate-300 bg-slate-50 p-3 sm:p-4"
              >
                {isTerbuka && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-white p-3">
                      <span className="rounded-lg bg-slate-100 px-3 py-2 text-lg font-semibold text-slate-900">
                        Tersedia {jumlahTersedia} · Dipinjam {jumlahAktif} ·
                        Total {jenis.unit.length}
                      </span>
                      {jenis.perluDicek && (
                        <span className="rounded-lg border border-yellow-700 bg-yellow-50 px-3 py-2 text-lg font-bold text-yellow-950">
                          Perlu dicek
                        </span>
                      )}
                      {jenis.rusak && (
                        <span className="rounded-lg border border-red-700 bg-red-50 px-3 py-2 text-lg font-bold text-red-950">
                          Rusak
                        </span>
                      )}
                    </div>
                    {jenis.unitTampil.map((i) => {
                    const l = label[i.status];
                    return (
                      <article
                        key={i.id}
                        className={`rounded-lg border-l-8 p-4 ${l.kelas}`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <p className="text-xl font-bold sm:text-2xl">
                            {i.code}
                          </p>
                          <p
                            className={`rounded-lg border px-3 py-1 text-lg font-bold ${l.kelas}`}
                          >
                            {l.teks}
                          </p>
                        </div>
                        {(i.status === "dipinjam" ||
                          i.status === "perlu_dicek") && (
                          <p className="mt-2 text-lg">
                            Dipegang {i.pemegang} ({i.bagian}) sejak {i.sejak}
                          </p>
                        )}
                        {i.status === "rusak" && (
                          <p className="mt-2 text-lg">
                            Terakhir dipakai: {i.terakhirDipakai ?? "-"}
                            {i.catatan ? ` · Catatan: ${i.catatan}` : ""}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(i.status === "dipinjam" ||
                            i.status === "perlu_dicek") && (
                            <Link
                              href={`/kembali/${i.loanId}`}
                              className="inline-flex min-h-14 items-center rounded-lg bg-blue-700 px-5 py-3 text-lg font-bold text-white hover:bg-blue-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                            >
                              Kembalikan Alat
                            </Link>
                          )}
                          <Link
                            href={`/riwayat/${i.id}`}
                            className="inline-flex min-h-14 items-center rounded-lg border-2 border-slate-500 bg-white px-5 py-3 text-lg font-bold text-slate-950 hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
                          >
                            Riwayat
                          </Link>
                        </div>
                      </article>
                    );
                    })}
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}