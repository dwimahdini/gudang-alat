import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function Daftar({ params }: { params: Promise<{ tid: string }> }) {
  const { tid } = await params;

  const [{ data: teknisi }, { data: alat, error }] = await Promise.all([
    supabase.from("technicians").select("name").eq("id", tid).single(),
    supabase
      .from("tools")
      .select("id, code, loans(returned_at)")
      .eq("active", true)
      .eq("status", "ok")
      .order("code"),
  ]);

  if (error) return <p className="text-xl">Gagal: {error.message}</p>;

  const tersedia = (alat ?? []).filter(
    (a) =>
      !((a.loans ?? []) as unknown as { returned_at: string | null }[]).some(
        (l) => l.returned_at === null,
      ),
  );

  return (
    <>
      <p className="text-2xl mt-2">
        Langkah 2 dari 2: Alat apa yang dipinjam oleh{" "}
        <b>{teknisi?.name ?? "?"}</b>?
      </p>
      <p className="text-lg text-gray-600">(hanya alat yang tersedia)</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {tersedia.map((a) => (
          <Link
            key={a.id}
            href={`/pinjam/${tid}/${a.id}`}
            className="border-2 border-green-600 bg-green-50 rounded-lg p-5 text-center text-2xl font-bold hover:bg-green-100"
          >
            {a.code}
          </Link>
        ))}
      </div>
      {tersedia.length === 0 && (
        <p className="text-xl mt-6">Tidak ada alat yang tersedia.</p>
      )}
    </>
  );
}

export default function Halaman({
  params,
}: {
  params: Promise<{ tid: string }>;
}) {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <Link href="/pinjam" className="text-xl underline">
        ← Kembali
      </Link>
      <h1 className="text-4xl font-bold mt-4">Pinjamkan Alat</h1>
      <Suspense fallback={<p className="mt-4 text-xl">Memuat...</p>}>
        <Daftar params={params} />
      </Suspense>
    </main>
  );
}