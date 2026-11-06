import Link from "next/link";

export default function Kelola() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Link href="/" className="text-xl underline">
        ← Kembali
      </Link>
      <h1 className="text-4xl font-bold mt-4">Kelola Data</h1>
      <p className="text-2xl mt-2">Apa yang ingin diatur?</p>
      <div className="flex flex-wrap gap-4 mt-6">
        <Link
          href="/kelola/teknisi"
          className="px-8 py-6 rounded-lg bg-gray-900 text-white text-2xl font-bold"
        >
          Daftar Teknisi
        </Link>
        <Link
          href="/kelola/alat"
          className="px-8 py-6 rounded-lg bg-gray-900 text-white text-2xl font-bold"
        >
          Daftar Alat
        </Link>
      </div>
    </main>
  );
}
