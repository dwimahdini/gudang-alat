import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { waktuRelatif } from "@/lib/status";

type Baris = {
  id: string;
  borrowed_at: string;
  tools: { code: string } | null;
  technicians: { name: string; department: string } | null;
};

async function Daftar() {
  const { data, error } = await supabase
    .from("loans")
    .select("id, borrowed_at, tools(code), technicians(name, department)")
    .is("returned_at", null)
    .order("borrowed_at");

  if (error) return <p className="text-xl">Gagal: {error.message}</p>;

  const baris = (data ?? []) as unknown as Baris[];
  const now = Date.now();

  if (baris.length === 0)
    return <p className="text-xl mt-6">Tidak ada alat yang sedang dipinjam.</p>;

  return (
    <div className="space-y-3 mt-6">
      {baris.map((b) => (
        <Link
          key={b.id}
          href={`/kembali/${b.id}`}
          className="block border-2 border-blue-400 bg-blue-50 rounded-lg p-4 hover:bg-blue-100"
        >
          <p className="text-2xl font-bold">{b.tools?.code}</p>
          <p className="text-xl">
            Dipegang {b.technicians?.name} ({b.technicians?.department}) sejak{" "}
            {waktuRelatif(b.borrowed_at, now)}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default function Halaman() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <Link href="/" className="text-xl underline">
        ← Kembali
      </Link>
      <h1 className="text-4xl font-bold mt-4">Terima Kembali</h1>
      <p className="text-2xl mt-2">Alat mana yang dikembalikan?</p>
      <Suspense fallback={<p className="mt-4 text-xl">Memuat...</p>}>
        <Daftar />
      </Suspense>
    </main>
  );
}
