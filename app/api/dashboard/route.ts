import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { unauthorized } from "@/lib/response";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession(req);
  if (!session) {
    return unauthorized("Please Authenticate");
  }

  // Use the correct Prisma types
  let eventFilter: any = {};
  let upcomingEventFilter: any = {
    date: { gt: new Date() },
  };

  if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
    eventFilter = { createdBy: session.user.id };
    upcomingEventFilter = {
      createdBy: session.user.id,
      date: { gt: new Date() },
    };
  }

  const events = await prisma.event.count({ where: eventFilter });
  const upcomingEvents = await prisma.event.count({
    where: upcomingEventFilter,
  });

  // Attendees count
  let rsvpFilter: any = {};

  if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
    rsvpFilter = { event: { createdBy: session.user.id } };
  }

  const totalAttendees = await prisma.rsvp.count({ where: rsvpFilter });

  // Growth calculation
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const attendeesThisMonth = await prisma.rsvp.count({
    where: {
      createdAt: { gte: startOfThisMonth },
      ...(session.user.role !== "ADMIN" && session.user.role !== "STAFF"
        ? { event: { createdBy: session.user.id } }
        : {}),
    },
  });

  const attendeesLastMonth = await prisma.rsvp.count({
    where: {
      createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      ...(session.user.role !== "ADMIN" && session.user.role !== "STAFF"
        ? { event: { createdBy: session.user.id } }
        : {}),
    },
  });

  const growthPercentage =
    attendeesLastMonth === 0
      ? 100
      : ((attendeesThisMonth - attendeesLastMonth) / attendeesLastMonth) * 100;

  return NextResponse.json({
    events,
    upcomingEvents,
    totalAttendees,
    attendeesThisMonth,
    attendeesLastMonth,
    growthPercentage,
  });
}