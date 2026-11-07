"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function pinjamAlat(formData: FormData) {
  const toolIds = [
    ...new Set(
      formData
        .getAll("toolId")
        .map((id) => String(id).trim())
        .filter(Boolean),
    ),
  ];
  const technicianId = String(formData.get("technicianId"));
  const petugas = String(formData.get("petugas") || "Pak Anto");

  if (toolIds.length === 0) redirect("/?hasil=gagal");

  const { data, error: toolError } = await supabase
    .from("tools")
    .select("id, name, due_hours, status, active, loans(returned_at)")
    .in("id", toolIds)
    .order("code");

  if (toolError) throw new Error(toolError.message);
  const tools = (data ?? []) as unknown as {
    id: string;
    name: string;
    due_hours: number;
    status: string;
    active: boolean;
    loans: { returned_at: string | null }[];
  }[];
  const namaJenis = tools[0]?.name.trim().toLowerCase();
  const toolsValid =
    tools.length === toolIds.length &&
    tools.every(
      (tool) =>
        tool.active &&
        tool.status !== "rusak" &&
        !tool.loans.some((loan) => loan.returned_at === null) &&
        tool.name.trim().toLowerCase() === namaJenis,
    );

  if (!toolsValid) redirect("/?hasil=gagal");

  const dueAt = new Date(
    Date.now() + tools[0].due_hours * 3600 * 1000,
  ).toISOString();
  const pinjaman = tools.map((tool) => ({
    tool_id: tool.id,
    technician_id: technicianId,
    due_at: dueAt,
    recorded_by: petugas,
  }));
  const { error } = await supabase.from("loans").insert(pinjaman);

  if (error) {
    // 23505 = alat sudah punya pinjaman aktif (dicegah index unik di database)
    if (error.code === "23505") redirect("/?hasil=gagal");
    throw new Error(error.message);
  }

  revalidatePath("/");
  redirect("/?hasil=pinjam");
}

export async function kembalikanAlat(formData: FormData) {
  const loanId = String(formData.get("loanId"));
  const kondisi = String(formData.get("kondisi"));
  const catatan = String(formData.get("catatan") || "").trim();

  if (kondisi !== "baik" && kondisi !== "rusak") redirect("/?hasil=gagal");

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

  if (error || !loan) redirect("/?hasil=gagal");

  if (kondisi === "rusak") {
    await supabase.from("tools").update({ status: "rusak" }).eq("id", loan.tool_id);
  }

  revalidatePath("/");
  redirect("/?hasil=kembali");
}