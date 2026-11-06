"use client";

import { useState } from "react";
import Link from "next/link";

type PinjamanAktif = {
  id: string;
  jenis: string;
  code: string;
  pemegang: string;
  bagian: string;
  sejak: string;
};

export default function PilihPengembalian({
  pinjaman,
}: {
  pinjaman: PinjamanAktif[];
}) {
  const [terbuka, setTerbuka] = useState<string | null>(null);

  const jenisAlat = Object.values(
    pinjaman.reduce<Record<string, PinjamanAktif[]>>((kelompok, item) => {
      const kunci = item.jenis.trim().toLowerCase();
      (kelompok[kunci] ??= []).push(item);
      return kelompok;
    }, {}),
  ).sort((a, b) => a[0].jenis.localeCompare(b[0].jenis, "id"));

  return (
    <div className="mt-5 space-y-3">
      {jenisAlat.map((unit) => {
        const kunci = unit[0].jenis.trim().toLowerCase();
        const isTerbuka = terbuka === kunci;
        const idRincian = `pinjaman-${unit[0].id}`;

        return (
          <section
            key={kunci}
            className="overflow-hidden rounded-xl border-2 border-blue-600 bg-white"
          >
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                  {unit[0].jenis}
                </h2>
                <p className="mt-1 text-lg text-slate-700">
                  {unit.length} unit sedang dipinjam
                </p>
              </div>
              <button
                type="button"
                aria-expanded={isTerbuka}
                aria-controls={idRincian}
                onClick={() => setTerbuka(isTerbuka ? null : kunci)}
                className="min-h-12 rounded-lg border-2 border-blue-700 bg-blue-50 px-5 py-3 text-lg font-bold text-blue-950 hover:bg-blue-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                {isTerbuka ? "Tutup daftar unit" : `Lihat ${unit.length} unit`}
              </button>
            </div>
            <div
              id={idRincian}
              hidden={!isTerbuka}
              className="space-y-2 border-t border-blue-200 bg-blue-50 p-3 sm:p-4"
            >
              {isTerbuka &&
                unit.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col gap-3 rounded-lg border border-blue-300 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-blue-950">
                        {item.code}
                      </h3>
                      <p className="mt-1 text-lg text-slate-900">
                        Dipegang {item.pemegang} ({item.bagian}) sejak{" "}
                        {item.sejak}
                      </p>
                    </div>
                    <Link
                      href={`/kembali/${item.id}`}
                      className="inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-lg font-bold text-white hover:bg-blue-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                      Terima kembali →
                    </Link>
                  </article>
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
