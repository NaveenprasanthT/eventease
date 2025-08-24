import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// List all events
export async function GET(req: NextRequest) {
  let filter = {
    include: { owner: true, rsvps: true },
  };

  const events = await prisma.event.findMany(filter);

  // add attendeeCount to each event
  const eventsWithCount = events.map((event: any) => ({
    ...event,
    attendeeCount: event.rsvps.length,
  }));

  return NextResponse.json(eventsWithCount);
}
