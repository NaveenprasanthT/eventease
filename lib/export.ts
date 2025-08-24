import { format } from "date-fns";

export interface ExportableAttendee {
  id: string;
  name: string;
  email: string;
  eventId: string;
  eventTitle: string;
  status: "confirmed" | "cancelled";
  rsvpDate: string;
}

export interface ExportableEvent {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  capacity: number;
  attendeeCount: number;
}

export function exportAttendeesToCSV(
  attendees: ExportableAttendee[],
  filename = "attendees"
) {
  if (attendees.length === 0) {
    alert("No attendees to export");
    return;
  }

  const headers = ["Name", "Email", "Event", "Status", "RSVP Date"];

  const csvContent = [
    headers.join(","),
    ...attendees.map((attendee) =>
      [
        `"${attendee.name}"`,
        `"${attendee.email}"`,
        `"${attendee.eventTitle}"`,
        `"${attendee.status}"`,
        `"${format(new Date(attendee.rsvpDate), "yyyy-MM-dd HH:mm:ss")}"`,
      ].join(",")
    ),
  ].join("\n");

  downloadCSV(
    csvContent,
    `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`
  );
}

export function exportEventsToCSV(
  events: ExportableEvent[],
  filename = "events"
) {
  if (events.length === 0) {
    alert("No events to export");
    return;
  }

  const headers = [
    "Title",
    "Description",
    "Date & Time",
    "Location",
    "Capacity",
    "Attendees",
  ];

  const csvContent = [
    headers.join(","),
    ...events.map((event) =>
      [
        `"${event.title}"`,
        `"${event.description}"`,
        `"${format(new Date(event.dateTime), "yyyy-MM-dd HH:mm:ss")}"`,
        `"${event.location}"`,
        event.capacity.toString(),
        event.attendeeCount.toString(),
      ].join(",")
    ),
  ].join("\n");

  downloadCSV(
    csvContent,
    `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`
  );
}

function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
