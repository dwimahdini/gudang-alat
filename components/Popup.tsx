"use client";

export default function Popup({
  ok,
  judul,
  teks,
  onTutup,
}: {
  ok: boolean;
  judul: string;
  teks: string;
  onTutup: () => void;
}) {
  const warna = ok
    ? "border-green-700 bg-green-50 text-green-950"
    : "border-red-700 bg-red-50 text-red-950";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="popup-judul"
        aria-describedby="popup-teks"
        className={`w-full max-w-xl rounded-2xl border-4 p-6 text-center shadow-xl sm:p-8 ${warna}`}
      >
        <p aria-hidden="true" className="text-6xl font-bold">
          {ok ? "✔" : "⚠"}
        </p>
        <h2 id="popup-judul" className="mt-4 text-3xl font-bold sm:text-4xl">
          {judul}
        </h2>
        <p id="popup-teks" className="mt-4 text-2xl">
          {teks}
        </p>
        <button
          type="button"
          autoFocus
          onClick={onTutup}
          className="mt-7 min-h-16 w-full rounded-xl bg-slate-900 px-8 py-4 text-2xl font-bold text-white hover:bg-slate-800 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700 sm:w-auto sm:min-w-48"
        >
          OK
        </button>
      </section>
    </div>
  );
}
