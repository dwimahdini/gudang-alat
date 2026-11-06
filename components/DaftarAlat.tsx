"use client";

import { useState } from "react";
import Link from "next/link";
import type { ItemAlat, Status } from "@/lib/status";

const label: Record<Status, { teks: string; ikon: string; kelas: string }> = {
  perlu_dicek: {
    teks: "PERLU DICEK",
    ikon: "🟡",
    kelas: "bg-yellow-100 border-yellow-500",
  },
  rusak: { teks: "RUSAK", ikon: "🔴", kelas: "bg-red-100 border-red-500" },
  dipinjam: {
    teks: "DIPINJAM",
    ikon: "🔵",
    kelas: "bg-blue-50 border-blue-400",
  },
  tersedia: {
    teks: "TERSEDIA",
    ikon: "🟢",
    kelas: "bg-green-50 border-green-500",
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
    <div>
      <div className="flex flex-wrap gap-6 text-xl font-semibold my-4">
        <span>Dipinjam: {jumlahDipinjam}</span>
        <span>Perlu dicek: {hitung("perlu_dicek")}</span>
        <span>Rusak: {hitung("rusak")}</span>
        <span>Tersedia: {hitung("tersedia")}</span>
      </div>

      <input
        value={cari}
        onChange={(e) => setCari(e.target.value)}
        placeholder="Cari alat..."
        className="w-full max-w-md border-2 border-gray-400 rounded-lg p-3 text-xl"
      />

      <div className="flex flex-wrap gap-3 my-4">
        {tombol.map((t) => (
          <button
            key={t.nilai}
            onClick={() => setFilter(t.nilai)}
            className={`px-5 py-3 rounded-lg text-xl border-2 ${
              filter === t.nilai
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white border-gray-400"
            }`}
          >
            {t.teks}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {tampil.length === 0 && (
          <p className="text-xl">Tidak ada alat yang cocok.</p>
        )}
        {tampil.map((i) => {
          const l = label[i.status];
          return (
            <div key={i.id} className={`border-l-8 rounded-lg p-4 ${l.kelas}`}>
              <p className="text-2xl font-bold">
                {l.ikon} {l.teks} &nbsp; {i.code}
              </p>
              {(i.status === "dipinjam" || i.status === "perlu_dicek") && (
                <p className="text-xl mt-1">
                  Dipegang {i.pemegang} ({i.bagian}) sejak {i.sejak}
                </p>
              )}
              {i.status === "rusak" && (
                <p className="text-xl mt-1">
                  Terakhir dipakai: {i.terakhirDipakai ?? "-"}
                  {i.catatan ? ` · Catatan: ${i.catatan}` : ""}
                </p>
              )}

              <div className="flex flex-wrap gap-3 mt-3">
                {(i.status === "dipinjam" || i.status === "perlu_dicek") && (
                  <Link
                    href={`/kembali/${i.loanId}`}
                    className="px-5 py-2 rounded-lg bg-blue-700 text-white text-lg font-semibold"
                  >
                    Terima Kembali
                  </Link>
                )}
                <Link
                  href={`/riwayat/${i.id}`}
                  className="px-5 py-2 rounded-lg border-2 border-gray-500 bg-white text-lg font-semibold"
                >
                  Riwayat
                </Link>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}