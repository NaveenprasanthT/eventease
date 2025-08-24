import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// RSVP to an event (open access, just email + name)
export async function POST(req: NextRequest) {
  try {
    const { eventId, name, email, status } = await req.json();

    if (!eventId || !email || !name) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const rsvp = await prisma.rsvp.upsert({
      where: { eventId_email: { eventId, email } }, // one RSVP per email per event
      update: { status, name },
      create: { eventId, name, email, status },
    });

    return NextResponse.json(rsvp, { status: 201 });
  } catch (error) {
    console.error("RSVP Error:", error);
    return NextResponse.json(
      { message: "Error while RSVPing" },
      { status: 500 }
    );
  }
}
