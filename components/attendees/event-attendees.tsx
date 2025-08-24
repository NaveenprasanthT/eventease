"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasPermission, usePermissions } from "@/lib/permissions";
import { exportAttendeesToCSV } from "@/lib/export";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Search,
  Download,
  Mail,
  Users,
  Calendar,
  MapPin,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { eventApi } from "@/utils/api/events";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxAttendeeCount: number | null;
  attendeeCount: number;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  status: "confirmed" | "cancelled";
  rsvpDate: string;
}

interface EventAttendeesProps {
  eventId: string;
}

export function EventAttendees({ eventId }: EventAttendeesProps) {
  const { user } = usePermissions();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchEventInfo() {
      try {
        setIsLoading(true);
        try {
          const response = await eventApi.getById(eventId);
          setEvent(response);

          const attendeeRes: any = await eventApi.getAttendees(eventId);
          setAttendees(attendeeRes);
        } catch (error) {
          console.log(error);
        }
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }

    fetchEventInfo();
  }, [eventId]);

  useEffect(() => {
    const filtered = attendees.filter(
      (attendee) =>
        attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAttendees(filtered);
  }, [searchQuery, attendees]);

  const handleExportAttendees = () => {
    if (!hasPermission(user, "export_data")) {
      alert("You don't have permission to export data");
      return;
    }

    const exportData = filteredAttendees.map((attendee) => ({
      id: attendee.id,
      name: attendee.name,
      email: attendee.email,
      eventId: eventId,
      eventTitle: event?.title || "Unknown Event",
      status: attendee.status,
      rsvpDate: attendee.rsvpDate,
    }));

    const filename =
      event?.title.replace(/\s+/g, "-").toLowerCase() || "event-attendees";
    exportAttendeesToCSV(exportData, filename);
  };

  const handleRemoveAttendee = (attendeeId: string) => {
    if (
      confirm(
        "Are you sure you want to remove this attendee? ( Not yet deleted from DB )"
      )
    ) {
      setAttendees(attendees.filter((a) => a.id !== attendeeId));
    }
  };

  const handleSendEmail = (attendeeEmail: string) => {
    // TODO: Implement email functionality
    console.log("[v0] Sending email to:", attendeeEmail);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const confirmedAttendees = attendees.filter(
    (a) => a.status === "confirmed"
  ).length;
  const cancelledAttendees = attendees.filter(
    (a) => a.status === "cancelled"
  ).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Event not found
          </h3>
          <p className="text-gray-600 mb-4">
            The event you're looking for doesn't exist.
          </p>
          <Link href="/dashboard/events">
            <Button>Back to Events</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Event
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{event.title}</h2>
          <p className="text-gray-600 mt-2">Manage attendees for this event</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(event.date), "PPP 'at' p")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        {hasPermission(user, "export_data") && (
          <Button
            onClick={handleExportAttendees}
            disabled={filteredAttendees.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export List ({filteredAttendees.length})
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {confirmedAttendees}
            </div>
            <p className="text-xs text-muted-foreground">Active attendees</p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {cancelledAttendees}
            </div>
            <p className="text-xs text-muted-foreground">Cancelled RSVPs</p>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {event.maxAttendeeCount
                ? `${Math.round((confirmedAttendees / event.maxAttendeeCount) * 100)}%`
                : "∞"}
            </div>
            <p className="text-xs text-muted-foreground">
              {event.maxAttendeeCount
                ? `${confirmedAttendees} / ${event.maxAttendeeCount}`
                : "Unlimited"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Warning */}
      {event.maxAttendeeCount &&
        confirmedAttendees / event.maxAttendeeCount > 0.9 && (
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              This event is nearly at capacity ({confirmedAttendees} /{" "}
              {event.maxAttendeeCount} attendees).
            </AlertDescription>
          </Alert>
        )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Attendee List</CardTitle>
          <CardDescription>
            Search and manage your event attendees.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search attendees by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* <Button variant="outline" onClick={() => handleSendEmail("all")}>
              <Mail className="h-4 w-4 mr-2" />
              Email All
            </Button> */}
          </div>

          {filteredAttendees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No attendees found
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "No one has RSVP'd to this event yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Attendee</TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead>RSVP Date</TableHead> */}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendees.map((attendee) => (
                    <TableRow key={attendee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(attendee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{attendee.name}</div>
                            <div className="text-sm text-gray-500">
                              {attendee.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            attendee.status === "confirmed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {attendee.status}
                        </Badge>
                      </TableCell>
                      {/* <TableCell className="text-sm text-gray-500">
                        {format(
                          new Date(attendee.rsvpDate),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                      </TableCell> */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendEmail(attendee.email)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAttendee(attendee.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
