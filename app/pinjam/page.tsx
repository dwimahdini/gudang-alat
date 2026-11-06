import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function Daftar() {
  const { data, error } = await supabase
    .from("technicians")
    .select("id, name, department")
    .eq("active", true)
    .order("name");

  if (error) return <p className="text-xl">Gagal: {error.message}</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {data?.map((t) => (
        <Link
          key={t.id}
          href={`/pinjam/${t.id}`}
          className="border-2 border-gray-400 rounded-lg p-5 text-center hover:bg-gray-100"
        >
          <p className="text-2xl font-bold">{t.name}</p>
          <p className="text-lg text-gray-600">{t.department}</p>
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
      <h1 className="text-4xl font-bold mt-4">Pinjamkan Alat</h1>
      <p className="text-2xl mt-2">Langkah 1 dari 2: Siapa yang meminjam?</p>
      <Suspense fallback={<p className="mt-4 text-xl">Memuat...</p>}>
        <Daftar />
      </Suspense>
    </main>
  );
}
