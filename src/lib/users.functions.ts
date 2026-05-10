import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "cashier", "warehouse_manager", "owner"]),
  fullName: z.string().trim().max(120).optional(),
});

export const inviteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inviteSchema.parse(data))
  .handler(async ({ data, context }) => {
    // Verify caller is admin
    const { data: callerRoles, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (roleErr) throw new Response(roleErr.message, { status: 500 });
    const isAdmin = (callerRoles ?? []).some((r) => r.role === "admin");
    if (!isAdmin) {
      throw new Response("Forbidden: hanya admin yang bisa mengundang", {
        status: 403,
      });
    }

    const redirectTo =
      (process.env.SITE_URL ?? process.env.SUPABASE_URL ?? "") + "/dashboard";

    const { data: invited, error } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
        data: data.fullName ? { full_name: data.fullName } : undefined,
        redirectTo,
      });

    if (error || !invited?.user) {
      throw new Response(error?.message ?? "Gagal mengundang pengguna", {
        status: 400,
      });
    }

    const userId = invited.user.id;

    // Replace default 'cashier' role assigned by handle_new_user trigger
    // with the chosen initial role (only if different).
    if (data.role !== "cashier") {
      await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "cashier");
    }

    // Ensure the chosen role exists (idempotent via unique constraint)
    const { error: insertErr } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: userId, role: data.role },
        { onConflict: "user_id,role" }
      );
    if (insertErr) {
      throw new Response(insertErr.message, { status: 500 });
    }

    return { ok: true, userId, email: data.email };
  });
