import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { forbidden, unauthorized } from "@/lib/response";

// List all events
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession(req); // Check user session
  if (!session) {
    return unauthorized("Please Authenticate");
  }

  if (!(session.user.role === "ADMIN" || session.user.role === "STAFF")) {
    return forbidden("Access denied");
  }

  const users = await prisma.user.findMany({});

  return NextResponse.json(users);
}
