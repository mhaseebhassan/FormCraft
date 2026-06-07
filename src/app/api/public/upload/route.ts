import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    uploadUrl: "/api/public/upload",
    method: "POST",
    note: "MVP local upload endpoint. Configure object storage for production.",
  });
}
