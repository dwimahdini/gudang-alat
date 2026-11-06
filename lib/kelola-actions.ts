"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export type Hasil = { ok: boolean; pesan: string; perluKonfirmasi?: boolean };

function segarkan() {
  revalidatePath("/");
  revalidatePath("/pinjam");
  revalidatePath("/kelola/teknisi");
  revalidatePath("/kelola/alat");
}

export async function tambahTeknisi(_prev: Hasil, formData: FormData): Promise<Hasil> {
  const nama = String(formData.get("nama") || "").trim();
  const bagian = String(formData.get("bagian") || "").trim();
  const paksa = formData.get("paksa") === "1";

  if (!nama) return { ok: false, pesan: "Nama belum diisi." };
  if (!bagian) return { ok: false, pesan: "Bagian belum dipilih." };

  if (!paksa) {
    const { data: semua } = await supabase
      .from("technicians")
      .select("name, department");
    const n = nama.toLowerCase();
    const mirip = (semua ?? []).find((t) => {
      const x = t.name.toLowerCase();
      return x.includes(n) || n.includes(x);
    });
    if (mirip) {
      return {
        ok: false,
        perluKonfirmasi: true,
        pesan: `Sudah ada ${mirip.name} (${mirip.department}). Tetap tambah?`,
      };
    }
  }

  const { error } = await supabase
    .from("technicians")
    .insert({ name: nama, department: bagian });
  if (error) return { ok: false, pesan: `Gagal menyimpan: ${error.message}` };

  segarkan();
  return { ok: true, pesan: `${nama} berhasil ditambahkan.` };
}

export async function tambahAlat(_prev: Hasil, formData: FormData): Promise<Hasil> {
  const nama = String(formData.get("nama") || "").trim();
  const jumlah = Number(formData.get("jumlah") || 1);

  if (!nama) return { ok: false, pesan: "Nama alat belum diisi." };
  if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 20) {
    return { ok: false, pesan: "Jumlah harus antara 1 sampai 20." };
  }

  // Pakai penulisan nama yang sudah ada (kalau ada), lalu lanjutkan nomor urutnya
  const { data: ada } = await supabase.from("tools").select("code, name");
  const sama = (ada ?? []).filter(
    (t) => t.name.toLowerCase() === nama.toLowerCase(),
  );
  const namaFinal = sama[0]?.name ?? nama;
  const nomorTerbesar = sama.reduce((maks, t) => {
    const m = /(\d+)$/.exec(t.code);
    return m ? Math.max(maks, Number(m[1])) : maks;
  }, 0);

  const baris = Array.from({ length: jumlah }, (_, i) => ({
    name: namaFinal,
    code: `${namaFinal} ${String(nomorTerbesar + i + 1).padStart(2, "0")}`,
  }));

  const { error } = await supabase.from("tools").insert(baris);
  if (error) {
    if (error.code === "23505") {
      return { ok: false, pesan: "Kode alat bentrok. Silakan coba lagi." };
    }
    return { ok: false, pesan: `Gagal menyimpan: ${error.message}` };
  }

  segarkan();
  return {
    ok: true,
    pesan: `${baris.map((b) => b.code).join(", ")} berhasil ditambahkan.`,
  };
}

export async function ubahData(_prev: Hasil, formData: FormData): Promise<Hasil> {
  const tabel = String(formData.get("tabel"));
  const id = String(formData.get("id"));
  const aksi = String(formData.get("aksi"));

  if (tabel !== "technicians" && tabel !== "tools") {
    return { ok: false, pesan: "Permintaan tidak dikenali." };
  }

  if (aksi === "nonaktifkan") {
    const kolom = tabel === "technicians" ? "technician_id" : "tool_id";
    const { data: aktif } = await supabase
      .from("loans")
      .select("id")
      .eq(kolom, id)
      .is("returned_at", null)
      .limit(1);

    if (aktif && aktif.length > 0) {
      return {
        ok: false,
        pesan:
          tabel === "technicians"
            ? "Masih memegang alat. Terima kembali alatnya dulu."
            : "Alat ini sedang dipinjam. Terima kembali dulu.",
      };
    }
    const { error } = await supabase.from(tabel).update({ active: false }).eq("id", id);
    if (error) return { ok: false, pesan: error.message };
  } else if (aksi === "aktifkan") {
    const { error } = await supabase.from(tabel).update({ active: true }).eq("id", id);
    if (error) return { ok: false, pesan: error.message };
  } else if (aksi === "pulihkan" && tabel === "tools") {
    const { error } = await supabase.from("tools").update({ status: "ok" }).eq("id", id);
    if (error) return { ok: false, pesan: error.message };
  } else {
    return { ok: false, pesan: "Permintaan tidak dikenali." };
  }

  segarkan();
  return { ok: true, pesan: "" };
}