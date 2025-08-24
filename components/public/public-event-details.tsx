"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users, Clock, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { RSVPForm } from "./rsvp-form";
import { eventApi } from "@/utils/api/events";
import { usePathname } from "next/navigation";

interface PublicEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxAttendeeCount: number | null;
  attendeeCount: number;
  createdAt: string;
}

interface PublicEventDetailsProps {
  eventId: string;
}

export function PublicEventDetails({ eventId }: PublicEventDetailsProps) {
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVPForm, setShowRSVPForm] = useState(false);

  const pathname = usePathname();
  const currentUrl =
    typeof window !== "undefined" ? window.location.origin + pathname : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

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

  const handleRSVPEvent = () => {
    setShowRSVPForm(false);
    // Update attendee count
    setEvent((prev) =>
      prev ? { ...prev, attendeeCount: prev.attendeeCount + 1 } : null
    );
  };

  useEffect(() => {
    if (eventId) {
      fetchEventById();
    }
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Event not found
            </h3>
            <p className="text-gray-600 mb-4">
              The event you're looking for doesn't exist or is no longer
              available.
            </p>
            <Link href="/events">
              <Button>Browse Other Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isEventFull =
    event.maxAttendeeCount && event.attendeeCount >= event.maxAttendeeCount;
  const isEventPast = new Date(event.date) < new Date();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/events">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
      </Link>

      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            <span>{format(new Date(event.date), "h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-600" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                {event.description.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Date & Time</h4>
                    <p className="text-gray-600">
                      {format(new Date(event.date), "PPP")}
                    </p>
                    <p className="text-gray-600">
                      {format(new Date(event.date), "p")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Location</h4>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Capacity</h4>
                    <p className="text-gray-600">
                      {event.attendeeCount} /{" "}
                      {event.maxAttendeeCount || "Unlimited"} attendees
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Status</h4>
                    {isEventPast ? (
                      <Badge variant="secondary">Event Ended</Badge>
                    ) : isEventFull ? (
                      <Badge variant="destructive">Sold Out</Badge>
                    ) : (
                      <Badge variant="default">Open for Registration</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RSVP Section */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                RSVP for This Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEventPast ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">
                    This event has already ended.
                  </p>
                  <Link href="/events">
                    <Button variant="outline" className="w-full bg-transparent">
                      Browse Other Events
                    </Button>
                  </Link>
                </div>
              ) : isEventFull ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">
                    This event is currently sold out.
                  </p>
                  <Button disabled className="w-full">
                    Event Full
                  </Button>
                </div>
              ) : showRSVPForm ? (
                <RSVPForm
                  eventId={event.id}
                  eventTitle={event.title}
                  onSuccess={handleRSVPEvent}
                  onCancel={() => setShowRSVPForm(false)}
                />
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {event.attendeeCount}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {event.maxAttendeeCount
                        ? `of ${event.maxAttendeeCount} spots taken`
                        : "people attending"}
                    </p>
                    {event.maxAttendeeCount && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((event.attendeeCount / event.maxAttendeeCount) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <Button
                    onClick={() => setShowRSVPForm(true)}
                    className="w-full text-lg py-6"
                    size="lg"
                  >
                    RSVP Now - It's Free!
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By RSVPing, you'll receive event updates and reminders.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={handleCopy}
                >
                  Copy Event Link
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  Share on Social Media
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
