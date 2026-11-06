import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatTanggal } from "@/lib/status";

type P = Promise<{ toolId: string }>;

type Pinjaman = {
  id: string;
  borrowed_at: string;
  returned_at: string | null;
  return_condition: string | null;
  note: string | null;
  recorded_by: string;
  technicians: { name: string; department: string } | null;
};

async function Isi({ params }: { params: P }) {
  const { toolId } = await params;

  const [{ data: alat }, { data, error }] = await Promise.all([
    supabase.from("tools").select("code, status").eq("id", toolId).single(),
    supabase
      .from("loans")
      .select(
        "id, borrowed_at, returned_at, return_condition, note, recorded_by, technicians(name, department)",
      )
      .eq("tool_id", toolId)
      .order("borrowed_at", { ascending: false }),
  ]);

  if (error) return <p className="text-xl">Gagal: {error.message}</p>;
  if (!alat) return <p className="text-xl">Alat tidak ditemukan.</p>;

  const riwayat = (data ?? []) as unknown as Pinjaman[];
  const terakhirRusak = riwayat.find((r) => r.return_condition === "rusak");

  return (
    <>
      <h2 className="text-3xl font-bold mt-2">{alat.code}</h2>

      {alat.status === "rusak" && (
        <div className="border-l-8 border-red-500 bg-red-100 rounded-lg p-4 mt-4">
          <p className="text-2xl font-bold">🔴 Alat ini berstatus RUSAK</p>
          <p className="text-xl mt-1">
            {terakhirRusak
              ? `Dikembalikan dalam kondisi rusak oleh ${terakhirRusak.technicians?.name ?? "-"} pada ${
                  terakhirRusak.returned_at
                    ? formatTanggal(terakhirRusak.returned_at)
                    : "-"
                }.`
              : "Belum ada catatan pengembalian rusak."}
            {terakhirRusak?.note ? ` Catatan: ${terakhirRusak.note}` : ""}
          </p>
        </div>
      )}

      <div className="space-y-3 mt-6">
        {riwayat.length === 0 && (
          <p className="text-xl">Belum ada riwayat pemakaian.</p>
        )}
        {riwayat.map((r) => {
          const rusak = r.return_condition === "rusak";
          return (
            <div
              key={r.id}
              className={`border-l-8 rounded-lg p-4 ${
                rusak
                  ? "bg-red-50 border-red-500"
                  : r.returned_at
                    ? "bg-gray-50 border-gray-400"
                    : "bg-blue-50 border-blue-400"
              }`}
            >
              <p className="text-2xl font-bold">
                {r.technicians?.name ?? "-"}{" "}
                <span className="text-lg font-normal text-gray-600">
                  ({r.technicians?.department ?? "-"})
                </span>
              </p>
              <p className="text-xl mt-1">
                Meminjam {formatTanggal(r.borrowed_at)}
                {r.returned_at
                  ? `, mengembalikan ${formatTanggal(r.returned_at)}`
                  : ", belum dikembalikan"}
              </p>
              {r.returned_at && (
                <p className="text-xl">
                  Kondisi: {rusak ? "🔴 RUSAK" : "🟢 Baik"}
                </p>
              )}
              {r.note && <p className="text-xl">Catatan: {r.note}</p>}
              <p className="text-base text-gray-600 mt-1">
                Dicatat oleh {r.recorded_by}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function Halaman({ params }: { params: P }) {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Link href="/" className="text-xl underline">
        ← Kembali
      </Link>
      <h1 className="text-4xl font-bold mt-4">Riwayat Pemakaian</h1>
      <Suspense fallback={<p className="mt-4 text-xl">Memuat...</p>}>
        <Isi params={params} />
      </Suspense>
    </main>
  );
}
