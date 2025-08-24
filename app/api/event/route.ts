import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { unauthorized } from "@/lib/response";

// Create event
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession(req); // Check user session
    if (!session) {
      return unauthorized("Please Authenticate");
    }

    const body = await req.json();
    const { title, description, location, date, maxAttendeeCount } = body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date,
        location,
        maxAttendeeCount,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error creating event" },
      { status: 500 }
    );
  }
}

// List all events
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession(req); // Check user session
  if (!session) {
    return unauthorized("Please Authenticate");
  }

  let filter = {};

  if (session.user.role === "ADMIN" || session.user.role === "STAFF") {
    filter = {
      include: { owner: true, rsvps: true },
    };
  } else {
    filter = {
      where: {
        createdBy: session.user.id,
      },
      include: { owner: true, rsvps: true },
    };
  }

  const events = await prisma.event.findMany(filter);

  // add attendeeCount to each event
  const eventsWithCount = events.map((event: any) => ({
    ...event,
    attendeeCount: event.rsvps.length,
  }));

  return NextResponse.json(eventsWithCount);
}
