"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Calendar, MapPin, Users, FileText } from "lucide-react";
import { eventApi } from "@/utils/api/events";
import { DateTimePicker } from "../ui/date-time-picker";

interface EventFormData {
  title: string;
  description: string;
  date: Date | undefined;
  location: string;
  maxAttendeeCount: string;
  isPublic: boolean;
}

export function EditEventForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: undefined,
    location: "",
    maxAttendeeCount: "",
    isPublic: true,
  });

  const handleInputChange = (
    field: keyof EventFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.title.trim()) {
      setError("Event title is required");
      setIsLoading(false);
      return;
    }

    if (!formData.date) {
      setError("Event date and time is required");
      setIsLoading(false);
      return;
    }

    if (!formData.location.trim()) {
      setError("Event location is required");
      setIsLoading(false);
      return;
    }

    // Check if date is in the future
    const eventDate = new Date(formData.date);
    if (eventDate <= new Date()) {
      setError("Event date must be in the future");
      setIsLoading(false);
      return;
    }

    try {
      await eventApi.update(eventId ,{
        title: formData.title,
        description: formData.description,
        date: formData?.date?.toISOString(), // ISO Date string
        maxAttendeeCount: formData.maxAttendeeCount
          ? Number.parseInt(formData.maxAttendeeCount)
          : null,
        location: formData.location,
      });

      setSuccess("Event update successfully!");

      // Redirect to events list after a short delay
      router.back();
    } catch (err) {
      setError("Failed to create event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventById = async () => {
    setIsLoading(true);
    try {
      const response = await eventApi.getById(eventId);
      setFormData({ ...response, date: new Date(response.date) });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEventById();
  }, [eventId]);

  return isLoading ? (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Event Details
        </CardTitle>
        <CardDescription>
          Provide the essential information for your event. All fields marked
          with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Event Title *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter event title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
              disabled={isLoading}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your event (optional)"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={isLoading}
              rows={4}
              className="text-base resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date & Time *
              </Label>
              {/* <Input
                id="date"
                type="date-local"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
                disabled={isLoading}
                min={new Date().toISOString().slice(0, 16)}
              /> */}
              <DateTimePicker
                value={formData.date}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, date: value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="maxAttendeeCount"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Max Attendees
              </Label>
              <Input
                id="maxAttendeeCount"
                type="number"
                placeholder="Leave empty for unlimited"
                value={formData.maxAttendeeCount || ""}
                onChange={(e) =>
                  handleInputChange("maxAttendeeCount", e.target.value)
                }
                disabled={isLoading}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location *
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="Enter event location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              required
              disabled={isLoading}
              className="text-base"
            />
          </div>

          {/* <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) =>
                handleInputChange("isPublic", checked)
              }
              disabled={isLoading}
            />
            <div className="flex-1">
              <Label
                htmlFor="isPublic"
                className="text-base font-medium cursor-pointer"
              >
                Public Event
              </Label>
              <p className="text-sm text-gray-600">
                {formData.isPublic
                  ? "Anyone can view and RSVP to this event"
                  : "Only people with the link can view this event"}
              </p>
            </div>
          </div> */}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Event...
                </>
              ) : (
                "Update Event"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
