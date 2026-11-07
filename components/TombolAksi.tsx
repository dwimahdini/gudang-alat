"use client";

import { useActionState } from "react";
import { ubahData, type Hasil } from "@/lib/kelola-actions";

const awal: Hasil = { ok: true, pesan: "" };

export default function TombolAksi({
  tabel,
  id,
  aksi,
  teks,
  kelas,
  konfirmasi,
}: {
  tabel: "technicians" | "tools";
  id: string;
  aksi: "nonaktifkan" | "aktifkan" | "pulihkan";
  teks: string;
  kelas: string;
  konfirmasi?: string;
}) {
  const [state, formAction, pending] = useActionState(ubahData, awal);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (konfirmasi && !window.confirm(konfirmasi)) e.preventDefault();
      }}
    >
      <input type="hidden" name="tabel" value={tabel} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="aksi" value={aksi} />
      <button
        type="submit"
        disabled={pending}
        className={`min-h-14 rounded-lg px-5 py-3 text-lg font-semibold focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50 ${kelas}`}
      >
        {pending ? "Memproses..." : teks}
      </button>
      {state.pesan && <p className="mt-2 text-lg text-yellow-700">{state.pesan}</p>}
    </form>
  );
}