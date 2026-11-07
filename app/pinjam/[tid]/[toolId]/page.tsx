import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { pinjamAlat } from "@/lib/actions";

type P = Promise<{ tid: string; toolId: string }>;
type Q = Promise<{ unitIds?: string | string[] }>;

async function Konfirmasi({
  params,
  searchParams,
}: {
  params: P;
  searchParams: Q;
}) {
  const { tid, toolId } = await params;
  const query = await searchParams;
  const unitIdsQuery = Array.isArray(query.unitIds)
    ? query.unitIds[0]
    : query.unitIds;
  const unitIds = unitIdsQuery
    ? [...new Set(unitIdsQuery.split(",").filter(Boolean))]
    : [toolId];

  const [{ data: teknisi }, { data: alat }] = await Promise.all([
    supabase
      .from("technicians")
      .select("name, department")
      .eq("id", tid)
      .single(),
    supabase
      .from("tools")
      .select("id, name, code, due_hours, status, active, loans(returned_at)")
      .in("id", unitIds)
      .order("code"),
  ]);

  type UnitPeminjaman = {
    id: string;
    name: string;
    code: string;
    due_hours: number;
    status: string;
    active: boolean;
    loans: { returned_at: string | null }[];
  };
  const unitAlat = (alat ?? []) as unknown as UnitPeminjaman[];
  const namaJenis = unitAlat[0]?.name.trim().toLowerCase();
  const unitValid =
    unitAlat.length === unitIds.length &&
    unitAlat.every(
      (unit) =>
        unit.active &&
        unit.status === "ok" &&
        !unit.loans.some((loan) => loan.returned_at === null) &&
        unit.name.trim().toLowerCase() === namaJenis,
    );

  if (!teknisi || !unitValid)
    return (
      <p className="mt-5 rounded-xl border border-slate-300 bg-slate-50 p-5 text-lg text-slate-800">
        Data tidak ditemukan.
      </p>
    );

  const kodeRingkas = unitAlat
    .slice(0, 3)
    .map((unit) => unit.code)
    .join(", ");

  return (
    <form action={pinjamAlat} className="mt-5">
      <input type="hidden" name="technicianId" value={tid} />
      {unitAlat.map((unit) => (
        <input key={unit.id} type="hidden" name="toolId" value={unit.id} />
      ))}

      <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-4 sm:p-5">
        <p className="text-lg font-semibold text-slate-700">
          Periksa detail peminjaman
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
          {teknisi.name}
        </p>
        <p className="mt-1 text-lg text-slate-800">{teknisi.department}</p>
        <div className="mt-3 rounded-lg border border-green-700 bg-green-50 p-3">
          <p className="text-lg font-semibold text-green-950">Alat</p>
          <p className="mt-1 text-2xl font-bold text-green-950">
            {unitAlat.length} unit {unitAlat[0].name}
          </p>
          <p className="mt-1 text-lg text-green-950">
            {kodeRingkas}
            {unitAlat.length > 3 && ` dan ${unitAlat.length - 3} unit lainnya`}
          </p>
        </div>
        <p className="mt-4 text-lg text-slate-800">
          Batas kembali:{" "}
          <span className="font-bold">
            {unitAlat[0].due_hours} jam dari sekarang
          </span>
        </p>
      </div>

      <fieldset className="mt-6">
        <legend className="text-xl font-bold text-slate-950">
          Peminjaman dicatat oleh
        </legend>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {["Pak Anto", "Petugas Malam"].map((n, i) => (
          <label
            key={n}
            className="flex min-h-16 cursor-pointer items-center gap-4 rounded-xl border-2 border-slate-300 bg-white p-4 text-lg font-semibold text-slate-950 hover:bg-slate-50 has-[:checked]:border-blue-700 has-[:checked]:bg-blue-50 focus-within:outline-4 focus-within:outline-offset-2 focus-within:outline-blue-700"
          >
            <input
              type="radio"
              name="petugas"
              value={n}
              defaultChecked={i === 0}
              className="h-6 w-6 accent-blue-700"
            />
            {n}
          </label>
        ))}
        </div>
      </fieldset>

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/"
          className="inline-flex min-h-14 items-center justify-center rounded-lg border-2 border-slate-400 bg-white px-6 py-3 text-lg font-bold text-slate-950 hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
        >
          Batal
        </Link>
        <button
          type="submit"
          className="min-h-14 rounded-lg bg-green-700 px-6 py-3 text-lg font-bold text-white hover:bg-green-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-green-700"
        >
          Ya, simpan peminjaman
        </button>
      </div>
    </form>
  );
}

export default function Halaman({
  params,
  searchParams,
}: {
  params: P;
  searchParams: Q;
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 text-slate-950 sm:px-6 sm:py-5">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-lg font-semibold text-slate-700">
            Langkah terakhir
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Periksa peminjaman
          </h1>
          <Suspense
            fallback={
              <p className="mt-5 rounded-lg bg-slate-100 p-4 text-lg text-slate-800">
                Memuat detail peminjaman...
              </p>
            }
          >
            <Konfirmasi params={params} searchParams={searchParams} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
