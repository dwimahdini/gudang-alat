import Link from "next/link";

export default function Gagal() {
  return (
    <main className="flex min-h-screen items-center bg-slate-50 px-4 py-8 text-slate-950 sm:px-6">
      <section className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <p
          aria-hidden="true"
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-4xl font-bold text-yellow-950"
        >
          ⚠
        </p>
        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          Tidak bisa disimpan
        </h1>
        <p className="mt-3 text-lg text-slate-800">
          Mungkin alat ini baru saja dicatat orang lain. Silakan cek Beranda,
          lalu coba lagi.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-lg font-bold text-white hover:bg-slate-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-700 sm:w-auto"
        >
          Kembali ke Beranda
        </Link>
      </section>
    </main>
  );
}
