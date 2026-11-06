"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function pinjamAlat(formData: FormData) {
  const toolId = String(formData.get("toolId"));
  const technicianId = String(formData.get("technicianId"));
  const petugas = String(formData.get("petugas") || "Pak Anto");

  const { data: tool } = await supabase
    .from("tools")
    .select("due_hours, status")
    .eq("id", toolId)
    .single();

  if (!tool || tool.status === "rusak") redirect("/gagal");

  const dueAt = new Date(Date.now() + tool.due_hours * 3600 * 1000).toISOString();

  const { error } = await supabase.from("loans").insert({
    tool_id: toolId,
    technician_id: technicianId,
    due_at: dueAt,
    recorded_by: petugas,
  });

  if (error) {
    // 23505 = alat sudah punya pinjaman aktif (dicegah index unik di database)
    if (error.code === "23505") redirect("/gagal");
    throw new Error(error.message);
  }

  revalidatePath("/");
  redirect("/berhasil");
}

export async function kembalikanAlat(formData: FormData) {
  const loanId = String(formData.get("loanId"));
  const kondisi = String(formData.get("kondisi"));
  const catatan = String(formData.get("catatan") || "").trim();

  if (kondisi !== "baik" && kondisi !== "rusak") redirect("/gagal");

  const { data: loan, error } = await supabase
    .from("loans")
    .update({
      returned_at: new Date().toISOString(),
      return_condition: kondisi,
      note: catatan || null,
    })
    .eq("id", loanId)
    .is("returned_at", null)
    .select("tool_id")
    .single();

  if (error || !loan) redirect("/gagal");

  if (kondisi === "rusak") {
    await supabase.from("tools").update({ status: "rusak" }).eq("id", loan.tool_id);
  }

  revalidatePath("/");
  redirect("/berhasil");
}