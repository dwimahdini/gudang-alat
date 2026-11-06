"use client";

import { useState } from "react";
import Link from "next/link";

type AlatTersedia = {
  id: string;
  name: string;
  code: string;
};

export default function PilihJenisAlat({
  tid,
  tools,
}: {
  tid: string;
  tools: AlatTersedia[];
}) {
  const [terbuka, setTerbuka] = useState<string | null>(null);

  const jenisAlat = Object.values(
    tools.reduce<Record<string, AlatTersedia[]>>((kelompok, alat) => {
      const kunci = alat.name.trim().toLowerCase();
      (kelompok[kunci] ??= []).push(alat);
      return kelompok;
    }, {}),
  ).sort((a, b) => a[0].name.localeCompare(b[0].name, "id"));

  return (
    <div className="mt-5 space-y-3">
      {jenisAlat.map((unit) => {
        const kunci = unit[0].name.trim().toLowerCase();
        const isTerbuka = terbuka === kunci;
        const idRincian = `unit-${unit[0].id}`;

        return (
          <section
            key={kunci}
            className="overflow-hidden rounded-xl border-2 border-slate-300 bg-white"
          >
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <h3 className="text-xl font-bold text-slate-950 sm:text-2xl">
                  {unit[0].name}
                </h3>
                <p className="mt-1 text-lg text-slate-700">
                  {unit.length} unit tersedia
                </p>
              </div>
              <button
                type="button"
                aria-expanded={isTerbuka}
                aria-controls={idRincian}
                onClick={() => setTerbuka(isTerbuka ? null : kunci)}
                className="min-h-12 rounded-lg border-2 border-green-700 bg-green-50 px-5 py-3 text-lg font-bold text-green-950 hover:bg-green-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-green-700"
              >
                {isTerbuka
                  ? "Tutup daftar unit"
                  : `Lihat ${unit.length} unit`}
              </button>
            </div>
            <div
              id={idRincian}
              hidden={!isTerbuka}
              className="space-y-2 border-t border-slate-300 bg-slate-50 p-3 sm:p-4"
            >
              {isTerbuka &&
                unit.map((alat) => (
                  <Link
                    key={alat.id}
                    href={`/pinjam/${tid}/${alat.id}`}
                    className="flex min-h-16 items-center justify-between gap-3 rounded-lg border-2 border-green-700 bg-white px-4 py-3 text-lg font-bold text-green-950 hover:bg-green-50 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                  >
                    <span>{alat.code}</span>
                    <span className="text-base font-semibold">Pilih unit →</span>
                  </Link>
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
