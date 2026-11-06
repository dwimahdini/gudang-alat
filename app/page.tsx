import { Suspense } from "react";
import { supabase } from "@/lib/supabase";

async function DaftarAlat() {
  const { data: tools, error } = await supabase
    .from("tools")
    .select("code, status")
    .order("code");

  if (error) {
    return <p className="text-xl">Gagal: {error.message}</p>;
  }

  return (
    <ul className="mt-4 text-xl space-y-1">
      {tools?.map((t) => (
        <li key={t.code}>{t.code}</li>
      ))}
    </ul>
  );
}

export default function Beranda() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Peminjaman Alat Gudang</h1>
      <Suspense
        fallback={<p className="mt-4 text-xl">Memuat daftar alat...</p>}
      >
        <DaftarAlat />
      </Suspense>
    </main>
  );
}
