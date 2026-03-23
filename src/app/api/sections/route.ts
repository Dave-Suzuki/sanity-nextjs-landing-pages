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

  // Verify the guide belongs to the user
  const { error: guideError } = await supabase
    .from("guides")
    .select("id")
    .eq("id", body.guide_id)
    .eq("user_id", user.id)
    .single();

  if (guideError) {
    return NextResponse.json({ error: "Guide not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("sections")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
