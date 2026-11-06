"use client";

import { useActionState, useState } from "react";
import { tambahTeknisi, tambahAlat, type Hasil } from "@/lib/kelola-actions";

const awal: Hasil = { ok: true, pesan: "" };
const daftarBagian = ["Mesin", "Listrik", "Utilitas", "Instrumen"];

function Pesan({ h }: { h: Hasil }) {
  if (!h.pesan) return null;
  return (
    <p
      className={`text-xl mt-4 font-semibold ${
        h.ok ? "text-green-700" : "text-red-700"
      }`}
    >
      {h.ok ? "✔ " : "⚠ "}
      {h.pesan}
    </p>
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
      className="border-2 border-gray-400 rounded-lg p-5"
    >
      <h2 className="text-2xl font-bold">+ Tambah Teknisi</h2>

      <label className="block text-xl mt-4">Nama</label>
      <input
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="w-full max-w-md border-2 border-gray-400 rounded-lg p-3 text-xl"
      />

      <p className="text-xl mt-4">Bagian</p>
      <div className="flex flex-wrap gap-3 mt-2">
        {daftarBagian.map((b) => (
          <label
            key={b}
            className={`flex items-center gap-2 border-2 rounded-lg px-4 py-3 text-xl cursor-pointer ${
              bagian === b ? "border-gray-900 bg-gray-100" : "border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="bagian"
              value={b}
              checked={bagian === b}
              onChange={() => setBagian(b)}
              className="w-5 h-5"
            />
            {b}
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button
          type="submit"
          disabled={pending}
          className="px-8 py-3 rounded-lg bg-green-700 text-white text-xl font-bold disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "SIMPAN"}
        </button>
        {state.perluKonfirmasi && (
          <button
            type="submit"
            name="paksa"
            value="1"
            disabled={pending}
            className="px-8 py-3 rounded-lg bg-yellow-600 text-white text-xl font-bold"
          >
            TETAP TAMBAH
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
      className="border-2 border-gray-400 rounded-lg p-5"
    >
      <h2 className="text-2xl font-bold">+ Tambah Alat</h2>
      <p className="text-lg text-gray-600 mt-1">
        Kode dibuat otomatis (contoh: Bor Listrik 03). Untuk menambah unit alat
        yang sudah ada, ketik nama yang sama.
      </p>

      <label className="block text-xl mt-4">Nama alat</label>
      <input
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="w-full max-w-md border-2 border-gray-400 rounded-lg p-3 text-xl"
      />

      <label className="block text-xl mt-4">Jumlah unit</label>
      <input
        name="jumlah"
        type="number"
        min={1}
        max={20}
        value={jumlah}
        onChange={(e) => setJumlah(e.target.value)}
        className="w-32 border-2 border-gray-400 rounded-lg p-3 text-xl"
      />

      <div className="mt-5">
        <button
          type="submit"
          disabled={pending}
          className="px-8 py-3 rounded-lg bg-green-700 text-white text-xl font-bold disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "SIMPAN"}
        </button>
      </div>

      <Pesan h={state} />
    </form>
  );
}
