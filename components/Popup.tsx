"use client";

import { useRouter } from "next/navigation";

export default function Popup({
  ok,
  judul,
  teks,
  onTutup,
}: {
  ok: boolean;
  judul: string;
  teks: string;
  onTutup: () => void;
}) {
  const router = useRouter();
  const warna = ok
    ? "border-green-700 bg-green-50 text-green-950"
    : "border-yellow-700 bg-yellow-50 text-yellow-950";
  const daftarKode = ok && teks.endsWith(" berhasil ditambahkan.")
    ? teks.slice(0, -" berhasil ditambahkan.".length).split(", ")
    : [];
  const unit = daftarKode.map((kode) => {
    const cocok = /^(.*)\s+(\d+)$/.exec(kode);
    return cocok ? { kode, nama: cocok[1].trim() } : null;
  });
  const namaJenis = unit[0]?.nama;
  const kodeAlat =
    unit.length > 0 &&
    unit.every(
      (item) =>
        item !== null &&
        item.nama.trim().toLowerCase() === namaJenis?.trim().toLowerCase(),
    );
  const ringkas = kodeAlat && unit.length > 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="popup-judul"
        aria-describedby="popup-teks"
        className={`w-full max-w-xl rounded-2xl border-4 p-6 text-center shadow-xl sm:p-8 ${warna}`}
      >
        <h2 id="popup-judul" className="text-4xl font-bold sm:text-5xl">
          {judul}
        </h2>
        {ringkas ? (
          <div id="popup-teks" className="mt-4">
            <p className="text-2xl font-bold">
              {unit.length} unit {namaJenis} berhasil ditambahkan
            </p>
            <p className="mt-2 text-lg">
              Tersedia {unit.length} unit, siap dipinjam.
            </p>
          </div>
        ) : (
          <p id="popup-teks" className="mt-4 text-xl">
            {teks}
          </p>
        )}
        <button
          type="button"
          autoFocus
          onClick={() => {
            onTutup();
            if (ok && judul === "Berhasil disimpan") router.replace("/");
          }}
          className="mt-7 min-h-16 w-full rounded-xl bg-slate-900 px-8 py-4 text-2xl font-bold text-white hover:bg-slate-800 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700 sm:w-auto sm:min-w-48"
        >
          OK
        </button>
      </section>
    </div>
  );
}
