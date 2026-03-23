import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ spotId: string }> }
) {
  const { spotId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership: spot -> subsection -> section -> guide -> user
  const { error: ownerError } = await supabase
    .from("spots")
    .select("subsections!inner(sections!inner(guides!inner(user_id)))")
    .eq("id", spotId)
    .eq("subsections.sections.guides.user_id", user.id)
    .single();

  if (ownerError) {
    return NextResponse.json({ error: "Spot not found" }, { status: 404 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("spots")
    .update(body)
    .eq("id", spotId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ spotId: string }> }
) {
  const { spotId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership: spot -> subsection -> section -> guide -> user
  const { error: ownerError } = await supabase
    .from("spots")
    .select("subsections!inner(sections!inner(guides!inner(user_id)))")
    .eq("id", spotId)
    .eq("subsections.sections.guides.user_id", user.id)
    .single();

  if (ownerError) {
    return NextResponse.json({ error: "Spot not found" }, { status: 404 });
  }

  const { error } = await supabase.from("spots").delete().eq("id", spotId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
