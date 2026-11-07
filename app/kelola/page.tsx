import Link from "next/link";

export default function Kelola() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 text-slate-950 sm:px-6 sm:py-5">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex min-h-14 items-center rounded-lg border-2 border-slate-400 bg-white px-4 py-2 text-lg font-semibold hover:bg-slate-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Kembali
        </Link>
        <section className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Kelola data
          </h1>
          <p className="mt-2 text-xl text-slate-800">
            Pilih daftar yang ingin diatur.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link
              href="/kelola/teknisi"
              className="flex min-h-16 items-center justify-center rounded-lg bg-slate-900 px-5 py-4 text-center text-xl font-bold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-700 sm:text-2xl"
            >
              Daftar teknisi
            </Link>
            <Link
              href="/kelola/alat"
              className="flex min-h-16 items-center justify-center rounded-lg bg-slate-900 px-5 py-4 text-center text-xl font-bold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-700 sm:text-2xl"
            >
              Daftar alat
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
