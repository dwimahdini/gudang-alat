"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Popup from "@/components/Popup";

const hasilPopup = {
  pinjam: {
    ok: true,
    judul: "Peminjaman berhasil",
    teks: "Peminjaman alat sudah tercatat.",
  },
  kembali: {
    ok: true,
    judul: "Pengembalian berhasil",
    teks: "Pengembalian alat sudah tercatat.",
  },
  gagal: {
    ok: false,
    judul: "Tidak berhasil",
    teks: "Data tidak tersimpan. Mungkin alat baru saja dicatat orang lain. Silakan cek daftar, lalu coba lagi.",
  },
};

export default function PopupHasil() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasil = searchParams.get("hasil");

  const pesan =
    hasil === "pinjam" || hasil === "kembali" || hasil === "gagal"
      ? hasilPopup[hasil]
      : null;

  if (!pesan) return null;

  return (
    <Popup
      ok={pesan.ok}
      judul={pesan.judul}
      teks={pesan.teks}
      onTutup={() => router.replace("/")}
    />
  );
}
