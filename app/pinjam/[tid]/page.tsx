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
      <p className="mt-5 text-lg font-semibold text-slate-700">
        Langkah 2 dari 2
      </p>
      <h2 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
        Pilih alat untuk {teknisi?.name ?? "?"}
      </h2>
      <p className="mt-2 text-lg text-slate-700">
        Pilihan hanya menampilkan alat yang tersedia.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tersedia.map((a) => (
          <Link
            key={a.id}
            href={`/pinjam/${tid}/${a.id}`}
            className="flex min-h-24 items-center justify-center rounded-xl border-2 border-green-700 bg-green-50 p-5 text-center text-2xl font-bold text-green-950 shadow-sm hover:bg-green-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            {a.code}
          </Link>
        ))}
      </div>
      {tersedia.length === 0 && (
        <p className="mt-5 rounded-xl border border-slate-300 bg-slate-50 p-5 text-lg text-slate-800">
          Tidak ada alat yang tersedia.
        </p>
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
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/pinjam"
          className="inline-flex min-h-12 items-center rounded-lg border-2 border-slate-400 bg-white px-4 py-2 text-lg font-semibold text-slate-950 hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          ← Kembali
        </Link>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pinjamkan alat
          </h1>
          <Suspense
            fallback={
              <p className="mt-5 rounded-lg bg-slate-100 p-4 text-lg text-slate-800">
                Memuat daftar alat...
              </p>
            }
          >
            <Daftar params={params} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}