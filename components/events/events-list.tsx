"use client";

import { useState, useEffect } from "react";
import { hasPermission, usePermissions } from "@/lib/permissions";
// import { exportEventsToCSV } from "@/lib/export";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash2,
  Download,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { User } from "@/lib/auth";
import { eventApi } from "@/utils/api/events";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxAttendeeCount: number | null;
  attendeeCount: number;
  isPublic: boolean;
  createdAt: string;
}

export function EventsList() {
  const { user } = usePermissions();

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllEvents = async () => {
    setIsLoading(true);
    try {
      const response = await eventApi.getAll();
      setEvents(response);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await eventApi.remove(eventId);
    } catch (err) {
      console.log(err);
    }
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const handleExportEvents = () => {
    if (!hasPermission(user, "export_data")) {
      alert("You don't have permission to export data");
      return;
    }

    // exportEventsToCSV(exportData, "my-events");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">My Events</h2>
          <div className="flex items-center gap-2">
            <Button disabled>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link href="/dashboard/events/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Events</h2>
          <p className="text-gray-600 mt-2">
            Manage and track all your events in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasPermission(user, "export_data") && events.length > 0 && (
            <Button variant="outline" onClick={handleExportEvents}>
              <Download className="h-4 w-4 mr-2" />
              Export ({events.length})
            </Button>
          )}
          <Link href="/dashboard/events/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {events.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No events yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first event.
            </p>
            <Link href="/dashboard/events/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <Badge variant={event.isPublic ? "default" : "secondary"}>
                        {event.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {event.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/dashboard/events/edit/${event.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.date), "PPP 'at' p")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.attendeeCount} / {event.maxAttendeeCount || "∞"}{" "}
                      attendees
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Created {format(new Date(event.createdAt), "PPP")}
                  </span>
                  <Link href={`/dashboard/events/${event.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
