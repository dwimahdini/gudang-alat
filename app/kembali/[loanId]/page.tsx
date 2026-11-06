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
      <p className="text-xl mt-6">
        Alat ini sudah dikembalikan atau tidak ditemukan.
      </p>
    );
  }

  return (
    <form action={kembalikanAlat} className="mt-6">
      <input type="hidden" name="loanId" value={loanId} />

      <p className="text-3xl font-bold">{loan.tools?.code}</p>
      <p className="text-xl">Dipinjam {loan.technicians?.name}</p>

      <p className="text-2xl font-semibold mt-6">Bagaimana kondisi alat?</p>
      <div className="flex flex-wrap gap-4 mt-2">
        <label className="flex items-center gap-3 border-2 border-green-600 rounded-lg p-4 text-2xl cursor-pointer">
          <input
            type="radio"
            name="kondisi"
            value="baik"
            required
            className="w-6 h-6"
          />
          🟢 BAIK
        </label>
        <label className="flex items-center gap-3 border-2 border-red-600 rounded-lg p-4 text-2xl cursor-pointer">
          <input
            type="radio"
            name="kondisi"
            value="rusak"
            required
            className="w-6 h-6"
          />
          🔴 RUSAK
        </label>
      </div>

      <p className="text-2xl font-semibold mt-6">
        Catatan (boleh dikosongkan):
      </p>
      <textarea
        name="catatan"
        rows={3}
        className="w-full border-2 border-gray-400 rounded-lg p-3 text-xl mt-2"
      />

      <div className="flex gap-4 mt-8">
        <Link
          href="/kembali"
          className="px-8 py-4 rounded-lg border-2 border-gray-500 text-2xl"
        >
          BATAL
        </Link>
        <button
          type="submit"
          className="px-8 py-4 rounded-lg bg-green-700 text-white text-2xl font-bold"
        >
          SIMPAN
        </button>
      </div>
    </form>
  );
}

export default function Halaman({ params }: { params: P }) {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold">Terima Kembali</h1>
      <Suspense fallback={<p className="mt-4 text-xl">Memuat...</p>}>
        <Form params={params} />
      </Suspense>
    </main>
  );
}
