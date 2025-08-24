import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ must await

  const session = await auth.api.getSession(req); // Check user session
  if (!session) {
    return unauthorized("Please Authenticate");
  }

  const attendees = await prisma.rsvp.findMany({
    where: {
      event: {
        is: { id }, // 👈 relation filter
      },
    },
  });

  return NextResponse.json(attendees);
}
