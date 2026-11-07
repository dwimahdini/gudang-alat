"use client";

import { useActionState, useState } from "react";
import { tambahTeknisi, tambahAlat, type Hasil } from "@/lib/kelola-actions";
import Popup from "@/components/Popup";

const awal: Hasil = { ok: true, pesan: "" };
const daftarBagian = ["Mesin", "Listrik", "Utilitas", "Instrumen"];

function Pesan({ h }: { h: Hasil }) {
  const [ditutup, setDitutup] = useState<Hasil | null>(null);

  if (!h.pesan) return null;
  if (h.perluKonfirmasi) {
    return (
      <p className="mt-4 rounded-lg bg-yellow-100 p-4 text-lg font-semibold text-yellow-950">
        {h.pesan}
      </p>
    );
  }
  if (ditutup === h) return null;

  return (
    <Popup
      ok={h.ok}
      judul={h.ok ? "Berhasil disimpan" : "Tidak berhasil"}
      teks={h.pesan}
      onTutup={() => setDitutup(h)}
    />
  );
}

export function FormTeknisi() {
  const [nama, setNama] = useState("");
  const [bagian, setBagian] = useState("");

  async function kirim(prev: Hasil, fd: FormData) {
    const hasil = await tambahTeknisi(prev, fd);
    if (hasil.ok) {
      setNama("");
      setBagian("");
    }
    return hasil;
  }

  const [state, formAction, pending] = useActionState(kirim, awal);

  return (
    <form
      action={formAction}
      className="rounded-xl border border-slate-300 bg-white p-4 sm:p-5"
    >
      <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
        + Tambah teknisi
      </h2>

      <label
        htmlFor="nama-teknisi"
        className="mt-4 block text-lg font-semibold text-slate-950"
      >
        Nama teknisi
      </label>
      <input
        id="nama-teknisi"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="mt-2 w-full rounded-lg border-2 border-slate-400 bg-white p-3 text-lg text-slate-950 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:max-w-md"
      />

      <p className="mt-4 text-lg font-semibold text-slate-950">Bagian</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {daftarBagian.map((b) => (
          <label
            key={b}
            className={`flex min-h-14 cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-3 text-lg font-semibold text-slate-950 focus-within:outline-4 focus-within:outline-offset-2 focus-within:outline-blue-700 ${
              bagian === b
                ? "border-blue-700 bg-blue-50"
                : "border-slate-400 bg-white hover:bg-slate-100"
            }`}
          >
            <input
              type="radio"
              name="bagian"
              value={b}
              checked={bagian === b}
              onChange={() => setBagian(b)}
              className="h-5 w-5 accent-blue-700"
            />
            {b}
          </label>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="min-h-14 rounded-lg bg-green-700 px-6 py-3 text-lg font-bold text-white hover:bg-green-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "Simpan teknisi"}
        </button>
        {state.perluKonfirmasi && (
          <button
            type="submit"
            name="paksa"
            value="1"
            disabled={pending}
            className="min-h-14 rounded-lg bg-yellow-600 px-6 py-3 text-lg font-bold text-white hover:bg-yellow-700 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-700 disabled:opacity-50"
          >
            Tetap tambah
          </button>
        )}
      </div>

      <Pesan h={state} />
    </form>
  );
}

export function FormAlat() {
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("1");

  async function kirim(prev: Hasil, fd: FormData) {
    const hasil = await tambahAlat(prev, fd);
    if (hasil.ok) {
      setNama("");
      setJumlah("1");
    }
    return hasil;
  }

  const [state, formAction, pending] = useActionState(kirim, awal);

  return (
    <form
      action={formAction}
      className="rounded-xl border border-slate-300 bg-white p-4 sm:p-5"
    >
      <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
        + Tambah alat
      </h2>
      <p className="mt-1 text-lg text-slate-700">
        Kode dibuat otomatis (contoh: Bor Listrik 03). Untuk menambah unit alat
        yang sudah ada, ketik nama yang sama.
      </p>

      <label
        htmlFor="nama-alat"
        className="mt-4 block text-lg font-semibold text-slate-950"
      >
        Nama alat
      </label>
      <input
        id="nama-alat"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="mt-2 w-full rounded-lg border-2 border-slate-400 bg-white p-3 text-lg text-slate-950 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:max-w-md"
      />

      <label
        htmlFor="jumlah-alat"
        className="mt-4 block text-lg font-semibold text-slate-950"
      >
        Jumlah unit
      </label>
      <input
        id="jumlah-alat"
        name="jumlah"
        type="number"
        min={1}
        max={20}
        value={jumlah}
        onChange={(e) => setJumlah(e.target.value)}
        className="mt-2 w-32 rounded-lg border-2 border-slate-400 bg-white p-3 text-lg text-slate-950 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      />

      <div className="mt-5">
        <button
          type="submit"
          disabled={pending}
          className="min-h-14 rounded-lg bg-green-700 px-6 py-3 text-lg font-bold text-white hover:bg-green-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "Simpan alat"}
        </button>
      </div>

      <Pesan h={state} />
    </form>
  );
}
