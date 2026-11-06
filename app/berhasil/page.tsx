import Link from "next/link";

export default function Berhasil() {
  return (
    <main className="p-6 max-w-2xl mx-auto text-center">
      <p className="text-6xl mt-16">✔</p>
      <h1 className="text-4xl font-bold mt-4">Tersimpan</h1>
      <Link
        href="/"
        className="inline-block mt-8 px-8 py-4 rounded-lg bg-gray-900 text-white text-2xl"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
