"use client";

import { useState, useEffect } from "react";
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
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { publicApi } from "@/utils/api/public";

interface PublicEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxAttendees: number | null;
  attendeeCount: number;
  createdAt: string;
}

export default function PublicEventsList() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<PublicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAllEvents = async () => {
    setIsLoading(true);
    try {
      const response = await publicApi.getAllEvents();
      setEvents(response);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Amazing Events
          </h2>
          <div className="h-10 bg-gray-200 rounded-lg w-full max-w-md mx-auto animate-pulse"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Amazing Events
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Find and join events happening in your community. From conferences to
          workshops, there's something for everyone.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-base h-12"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredEvents.length}{" "}
          {filteredEvents.length === 1 ? "event" : "events"} found
          {searchQuery && ` for "${searchQuery}"`}
        </p>
        {/* <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button> */}
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search terms."
                : "Check back later for new events."}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>{format(new Date(event.date), "PPP 'at' p")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>
                      {event.attendeeCount} / {event.maxAttendees || "∞"}{" "}
                      attendees
                    </span>
                  </div>
                </div>

                {/* Availability Badge */}
                <div className="mt-4 mb-4">
                  {event.maxAttendees &&
                  event.attendeeCount >= event.maxAttendees ? (
                    <Badge variant="destructive">Sold Out</Badge>
                  ) : event.maxAttendees &&
                    event.attendeeCount / event.maxAttendees > 0.8 ? (
                    <Badge variant="secondary">Almost Full</Badge>
                  ) : (
                    <Badge variant="default">Available</Badge>
                  )}
                </div>

                <Link href={`/events/${event.id}`}>
                  <Button className="w-full">View Details & RSVP</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="text-center py-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Want to create your own event?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of event organizers using EventEase to manage their
            events.
          </p>
          <Link href="/register">
            <Button size="lg">Get Started for Free</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
