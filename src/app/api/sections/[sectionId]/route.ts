import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const { sectionId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership through the guide
  const { error: ownerError } = await supabase
    .from("sections")
    .select("guides!inner(user_id)")
    .eq("id", sectionId)
    .eq("guides.user_id", user.id)
    .single();

  if (ownerError) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("sections")
    .update(body)
    .eq("id", sectionId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const { sectionId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership through the guide
  const { error: ownerError } = await supabase
    .from("sections")
    .select("guides!inner(user_id)")
    .eq("id", sectionId)
    .eq("guides.user_id", user.id)
    .single();

  if (ownerError) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("sections")
    .delete()
    .eq("id", sectionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
