"use client";

import { useState } from "react";
import Link from "next/link";
import type { ItemAlat, Status } from "@/lib/status";

const label: Record<Status, { teks: string; ikon: string; kelas: string }> = {
  perlu_dicek: {
    teks: "Perlu dicek",
    ikon: "🟡",
    kelas: "border-yellow-600 bg-yellow-50 text-yellow-950",
  },
  rusak: {
    teks: "Rusak",
    ikon: "🔴",
    kelas: "border-red-600 bg-red-50 text-red-950",
  },
  dipinjam: {
    teks: "Dipinjam",
    ikon: "🔵",
    kelas: "border-blue-600 bg-blue-50 text-blue-950",
  },
  tersedia: {
    teks: "Tersedia",
    ikon: "🟢",
    kelas: "border-green-600 bg-green-50 text-green-950",
  },
};

type Filter = "semua" | "dipinjam" | "perlu_dicek" | "rusak";

export default function DaftarAlat({ items }: { items: ItemAlat[] }) {
  const [filter, setFilter] = useState<Filter>("semua");
  const [cari, setCari] = useState("");

  const hitung = (s: Status) => items.filter((i) => i.status === s).length;
  const jumlahDipinjam = hitung("dipinjam") + hitung("perlu_dicek");

  const tampil = items.filter((i) => {
    const cocokFilter =
      filter === "semua" ||
      (filter === "dipinjam"
        ? i.status === "dipinjam" || i.status === "perlu_dicek"
        : i.status === filter);
    const cocokCari = i.code.toLowerCase().includes(cari.toLowerCase());
    return cocokFilter && cocokCari;
  });

  const tombol: { nilai: Filter; teks: string }[] = [
    { nilai: "semua", teks: "Semua" },
    { nilai: "dipinjam", teks: "Sedang dipinjam" },
    { nilai: "perlu_dicek", teks: "Perlu dicek" },
    { nilai: "rusak", teks: "Rusak" },
  ];

  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-4">
          <p className="text-lg font-semibold text-blue-950">🔵 Dipinjam</p>
          <p className="mt-1 text-3xl font-bold text-blue-950">
            {jumlahDipinjam}
          </p>
        </div>
        <div className="rounded-xl border-l-4 border-yellow-600 bg-yellow-50 p-4">
          <p className="text-lg font-semibold text-yellow-950">
            🟡 Perlu dicek
          </p>
          <p className="mt-1 text-3xl font-bold text-yellow-950">
            {hitung("perlu_dicek")}
          </p>
        </div>
        <div className="rounded-xl border-l-4 border-red-600 bg-red-50 p-4">
          <p className="text-lg font-semibold text-red-950">🔴 Rusak</p>
          <p className="mt-1 text-3xl font-bold text-red-950">
            {hitung("rusak")}
          </p>
        </div>
        <div className="rounded-xl border-l-4 border-green-600 bg-green-50 p-4">
          <p className="text-lg font-semibold text-green-950">🟢 Tersedia</p>
          <p className="mt-1 text-3xl font-bold text-green-950">
            {hitung("tersedia")}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="cari-alat"
          className="mb-2 block text-lg font-semibold text-slate-900"
        >
          Cari berdasarkan kode alat
        </label>
        <input
          id="cari-alat"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Contoh: ALAT-01"
          className="w-full rounded-lg border-2 border-slate-400 bg-white p-3 text-lg text-slate-950 placeholder:text-slate-600 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:max-w-md"
        />
      </div>

      <div className="my-4 flex flex-wrap gap-2 sm:gap-3">
        {tombol.map((t) => (
          <button
            key={t.nilai}
            onClick={() => setFilter(t.nilai)}
            className={`min-h-12 rounded-lg border-2 px-4 py-2 text-lg font-semibold focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:px-5 ${
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
        {tampil.length === 0 && (
          <p className="rounded-xl border border-slate-300 bg-slate-50 p-5 text-lg text-slate-800">
            Tidak ada alat yang cocok.
          </p>
        )}
        {tampil.map((i) => {
          const l = label[i.status];
          return (
            <article
              key={i.id}
              className={`rounded-xl border-l-8 p-4 sm:p-5 ${l.kelas}`}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-2xl font-bold">{i.code}</p>
                <p className="text-lg font-bold">
                  {l.ikon} {l.teks}
                </p>
              </div>
              {(i.status === "dipinjam" || i.status === "perlu_dicek") && (
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

              <div className="mt-4 flex flex-wrap gap-2">
                {(i.status === "dipinjam" || i.status === "perlu_dicek") && (
                  <Link
                    href={`/kembali/${i.loanId}`}
                    className="inline-flex min-h-12 items-center rounded-lg bg-blue-700 px-5 py-3 text-lg font-bold text-white hover:bg-blue-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    Terima Kembali
                  </Link>
                )}
                <Link
                  href={`/riwayat/${i.id}`}
                  className="inline-flex min-h-12 items-center rounded-lg border-2 border-slate-500 bg-white px-5 py-3 text-lg font-bold text-slate-950 hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
                >
                  Riwayat
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}