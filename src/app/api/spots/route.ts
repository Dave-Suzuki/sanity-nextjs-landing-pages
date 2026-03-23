import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Verify ownership: subsection -> section -> guide -> user
  const { error: ownerError } = await supabase
    .from("subsections")
    .select("sections!inner(guides!inner(user_id))")
    .eq("id", body.subsection_id)
    .eq("sections.guides.user_id", user.id)
    .single();

  if (ownerError) {
    return NextResponse.json(
      { error: "Subsection not found" },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from("spots")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
