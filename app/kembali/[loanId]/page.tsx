import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { kembalikanAlat } from "@/lib/actions";

type P = Promise<{ loanId: string }>;

async function Form({ params }: { params: P }) {
  const { loanId } = await params;

  const { data } = await supabase
    .from("loans")
    .select("id, returned_at, tools(code), technicians(name)")
    .eq("id", loanId)
    .single();

  const loan = data as unknown as {
    id: string;
    returned_at: string | null;
    tools: { code: string } | null;
    technicians: { name: string } | null;
  } | null;

  if (!loan || loan.returned_at) {
    return (
      <p className="mt-5 rounded-xl border border-yellow-600 bg-yellow-50 p-5 text-lg text-yellow-950">
        Alat ini sudah dikembalikan atau tidak ditemukan.
      </p>
    );
  }

  return (
    <form action={kembalikanAlat} className="mt-5">
      <input type="hidden" name="loanId" value={loanId} />

      <div className="rounded-xl border border-slate-300 bg-slate-50 p-5 sm:p-6">
        <p className="text-lg font-semibold text-slate-700">Alat</p>
        <p className="mt-1 text-3xl font-bold text-slate-950">
          {loan.tools?.code}
        </p>
        <p className="mt-2 text-lg text-slate-800">
          Dipinjam oleh{" "}
          <span className="font-bold">{loan.technicians?.name}</span>
        </p>
      </div>

      <fieldset className="mt-6">
        <legend className="text-xl font-bold text-slate-950">
          Bagaimana kondisi alat?
        </legend>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex min-h-16 cursor-pointer items-center gap-4 rounded-xl border-2 border-green-700 bg-green-50 p-4 text-xl font-bold text-green-950 hover:bg-green-100 has-[:checked]:ring-4 has-[:checked]:ring-green-700 focus-within:outline-4 focus-within:outline-offset-2 focus-within:outline-green-700">
            <input
              type="radio"
              name="kondisi"
              value="baik"
              required
              className="h-6 w-6 accent-green-700"
            />
            🟢 Baik
          </label>
          <label className="flex min-h-16 cursor-pointer items-center gap-4 rounded-xl border-2 border-red-700 bg-red-50 p-4 text-xl font-bold text-red-950 hover:bg-red-100 has-[:checked]:ring-4 has-[:checked]:ring-red-700 focus-within:outline-4 focus-within:outline-offset-2 focus-within:outline-red-700">
            <input
              type="radio"
              name="kondisi"
              value="rusak"
              required
              className="h-6 w-6 accent-red-700"
            />
            🔴 Rusak
          </label>
        </div>
      </fieldset>

      <div className="mt-6">
        <label
          htmlFor="catatan"
          className="block text-lg font-semibold text-slate-950"
        >
          Catatan (boleh dikosongkan)
        </label>
        <textarea
          id="catatan"
          name="catatan"
          rows={3}
          className="mt-2 w-full rounded-lg border-2 border-slate-400 bg-white p-3 text-lg text-slate-950 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        />
      </div>

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/kembali"
          className="inline-flex min-h-14 items-center justify-center rounded-lg border-2 border-slate-400 bg-white px-6 py-3 text-lg font-bold text-slate-950 hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
        >
          Batal
        </Link>
        <button
          type="submit"
          className="min-h-14 rounded-lg bg-green-700 px-6 py-3 text-lg font-bold text-white hover:bg-green-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-green-700"
        >
          Simpan pengembalian
        </button>
      </div>
    </form>
  );
}

export default function Halaman({ params }: { params: P }) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/kembali"
          className="inline-flex min-h-12 items-center rounded-lg border-2 border-slate-400 bg-white px-4 py-2 text-lg font-semibold hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          ← Batal dan kembali
        </Link>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Terima kembali
          </h1>
          <Suspense
            fallback={
              <p className="mt-5 rounded-lg bg-slate-100 p-4 text-lg text-slate-800">
                Memuat detail alat...
              </p>
            }
          >
            <Form params={params} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
