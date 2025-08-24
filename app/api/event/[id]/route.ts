import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/response";
import { auth } from "@/lib/auth";

// Get event by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 👈 params is async
) {
  const session = await auth.api.getSession(req); // Check user session
  if (!session) {
    return unauthorized("Please Authenticate");
  }

  const { id } = await params; // 👈 must await params

  const event = await prisma.event.findUnique({
    where: { id },
    include: { rsvps: true, owner: true, _count: { select: { rsvps: true } } },
  });

  const eventWithCount = {
    ...event,
    attendeeCount: event?._count.rsvps ?? 0,
  };

  return event
    ? NextResponse.json(eventWithCount)
    : NextResponse.json({ message: "Not found" }, { status: 404 });
}

// Update event
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession(req); // Check user session
  if (!session) {
    return unauthorized("Please Authenticate");
  }

  const body = await req.json();
  const updated = await prisma.event.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json(updated);
}

// Delete event
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession(req); // Check user session
  if (!session) {
    return unauthorized("Please Authenticate");
  }

  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
