import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { pinjamAlat } from "@/lib/actions";

type P = Promise<{ tid: string; toolId: string }>;

async function Konfirmasi({ params }: { params: P }) {
  const { tid, toolId } = await params;

  const [{ data: teknisi }, { data: alat }] = await Promise.all([
    supabase
      .from("technicians")
      .select("name, department")
      .eq("id", tid)
      .single(),
    supabase.from("tools").select("code, due_hours").eq("id", toolId).single(),
  ]);

  if (!teknisi || !alat)
    return <p className="text-xl">Data tidak ditemukan.</p>;

  return (
    <form action={pinjamAlat} className="mt-6">
      <input type="hidden" name="technicianId" value={tid} />
      <input type="hidden" name="toolId" value={toolId} />

      <div className="border-2 border-gray-400 rounded-lg p-6 text-center">
        <p className="text-3xl font-bold">
          {teknisi.name} ({teknisi.department}) meminjam {alat.code}
        </p>
        <p className="text-xl mt-2">
          Batas kembali: {alat.due_hours} jam dari sekarang
        </p>
      </div>

      <p className="text-2xl font-semibold mt-6">Dicatat oleh:</p>
      <div className="flex flex-wrap gap-4 mt-2">
        {["Pak Anto", "Petugas Malam"].map((n, i) => (
          <label
            key={n}
            className="flex items-center gap-3 border-2 border-gray-400 rounded-lg p-4 text-2xl cursor-pointer"
          >
            <input
              type="radio"
              name="petugas"
              value={n}
              defaultChecked={i === 0}
              className="w-6 h-6"
            />
            {n}
          </label>
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <Link
          href="/"
          className="px-8 py-4 rounded-lg border-2 border-gray-500 text-2xl"
        >
          BATAL
        </Link>
        <button
          type="submit"
          className="px-8 py-4 rounded-lg bg-green-700 text-white text-2xl font-bold"
        >
          YA, SIMPAN
        </button>
      </div>
    </form>
  );
}

export default function Halaman({ params }: { params: P }) {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold">Sudah benar?</h1>
      <Suspense fallback={<p className="mt-4 text-xl">Memuat...</p>}>
        <Konfirmasi params={params} />
      </Suspense>
    </main>
  );
}
