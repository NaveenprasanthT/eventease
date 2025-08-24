"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
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
  isPublic: boolean;
  createdAt: string;
}

interface EventDetailsProps {
  eventId: string;
}

export function EventDetails({ eventId }: EventDetailsProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEventById = async () => {
    setIsLoading(true);
    try {
      const response = await eventApi.getById(eventId);
      setEvent(response);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEventById();
  }, [eventId]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await eventApi.remove(eventId);

      router.push("/dashboard/events");
    } catch (error) {
      console.log("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const copyEventLink = () => {
    const eventUrl = `${window.location.origin}/events/${eventId}`;
    navigator.clipboard.writeText(eventUrl);
    // TODO: Show toast notification
    console.log("[v0] Event link copied:", eventUrl);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
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
            The event you're looking for doesn't exist or has been deleted.
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
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-gray-900">{event.title}</h2>
            <Badge variant={event.isPublic ? "default" : "secondary"}>
              {event.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
          <p className="text-gray-600">
            Created {format(new Date(event.createdAt), "PPP")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={copyEventLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          <Link href={`/events/${event.id}`} target="_blank">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Page
            </Button>
          </Link>
          <Link href={`/dashboard/events/edit/${event.id}`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 leading-relaxed">
                  {event.description || "No description provided."}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Date & Time</p>
                    <p className="text-gray-600">
                      {format(new Date(event.date), "PPP 'at' p")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {event.attendeeCount}
                </div>
                <p className="text-gray-600 mb-4">
                  {event.maxAttendeeCount
                    ? `of ${event.maxAttendeeCount} max attendees`
                    : "attendees (unlimited)"}
                </p>
                {event.maxAttendeeCount && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((event.attendeeCount / event.maxAttendeeCount) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                )}
                <Link href={`/dashboard/events/${event.id}/attendees`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Manage Attendees
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/dashboard/events/edit/${event.id}`}>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event Details
                </Button>
              </Link>
              <Link href={`/dashboard/events/${event.id}/attendees`}>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Attendee List
                </Button>
              </Link>
              {/* <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Event
              </Button> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
