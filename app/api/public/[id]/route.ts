import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get event by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 👈 params is async
) {
  const { id } = await params; // 👈 must await params

  const event = await prisma.event.findUnique({
    where: { id },
    include: { rsvps: true, owner: true, _count: { select: { rsvps: true } } },
  });

  const eventWithCount = {
    ...event,
    attendeeCount: event?._count.rsvps || 0,
  };

  return event
    ? NextResponse.json(eventWithCount)
    : NextResponse.json({ message: "Not found" }, { status: 404 });
}
