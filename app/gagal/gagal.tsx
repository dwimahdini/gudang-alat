import Link from "next/link";

export default function Gagal() {
  return (
    <main className="p-6 max-w-2xl mx-auto text-center">
      <p className="text-6xl mt-16">⚠</p>
      <h1 className="text-3xl font-bold mt-4">Tidak bisa disimpan</h1>
      <p className="text-xl mt-2">
        Mungkin alat ini baru saja dicatat orang lain. Silakan cek Beranda, lalu
        coba lagi.
      </p>
      <Link
        href="/"
        className="inline-block mt-8 px-8 py-4 rounded-lg bg-gray-900 text-white text-2xl"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
