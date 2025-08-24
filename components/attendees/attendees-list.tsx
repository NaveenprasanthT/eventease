"use client"

import { useState, useEffect } from "react"
import { hasPermission, usePermissions } from "@/lib/permissions"
import { exportAttendeesToCSV } from "@/lib/export"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Download, Users, Calendar, Mail } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface Attendee {
  id: string
  name: string
  email: string
  eventId: string
  eventTitle: string
  status: "confirmed" | "cancelled"
  rsvpDate: string
}

interface Event {
  id: string
  title: string
  dateTime: string
  attendeeCount: number
}

export function AttendeesList() {
  const { user } = usePermissions();
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    // Mock data - will be replaced with real API calls
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "Tech Conference 2024",
        dateTime: "2024-06-15T09:00:00Z",
        attendeeCount: 247,
      },
      {
        id: "2",
        title: "Product Launch Event",
        dateTime: "2024-07-10T18:00:00Z",
        attendeeCount: 89,
      },
      {
        id: "3",
        title: "Team Building Workshop",
        dateTime: "2024-05-20T14:00:00Z",
        attendeeCount: 32,
      },
    ]

    const mockAttendees: Attendee[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        eventId: "1",
        eventTitle: "Tech Conference 2024",
        status: "confirmed",
        rsvpDate: "2024-01-20T10:30:00Z",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        eventId: "1",
        eventTitle: "Tech Conference 2024",
        status: "confirmed",
        rsvpDate: "2024-01-22T14:15:00Z",
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        eventId: "2",
        eventTitle: "Product Launch Event",
        status: "confirmed",
        rsvpDate: "2024-02-05T09:45:00Z",
      },
      {
        id: "4",
        name: "Alice Brown",
        email: "alice@example.com",
        eventId: "1",
        eventTitle: "Tech Conference 2024",
        status: "cancelled",
        rsvpDate: "2024-01-25T16:20:00Z",
      },
      {
        id: "5",
        name: "Charlie Wilson",
        email: "charlie@example.com",
        eventId: "3",
        eventTitle: "Team Building Workshop",
        status: "confirmed",
        rsvpDate: "2024-02-10T11:00:00Z",
      },
    ]

    setTimeout(() => {
      setEvents(mockEvents)
      setAttendees(mockAttendees)
      setFilteredAttendees(mockAttendees)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = attendees

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (attendee) =>
          attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          attendee.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by event
    if (selectedEvent !== "all") {
      filtered = filtered.filter((attendee) => attendee.eventId === selectedEvent)
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((attendee) => attendee.status === statusFilter)
    }

    setFilteredAttendees(filtered)
  }, [searchQuery, selectedEvent, statusFilter, attendees])

  const handleExportAttendees = () => {
    if (!hasPermission(user, "export_data")) {
      alert("You don't have permission to export data")
      return
    }

    const exportData = filteredAttendees.map((attendee) => ({
      id: attendee.id,
      name: attendee.name,
      email: attendee.email,
      eventId: attendee.eventId,
      eventTitle: attendee.eventTitle,
      status: attendee.status,
      rsvpDate: attendee.rsvpDate,
    }))

    const filename =
      selectedEvent !== "all"
        ? `attendees-${events
            .find((e) => e.id === selectedEvent)
            ?.title.replace(/\s+/g, "-")
            .toLowerCase()}`
        : "all-attendees"

    exportAttendeesToCSV(exportData, filename)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const totalAttendees = attendees.filter((a) => a.status === "confirmed").length
  const totalEvents = events.length
  const recentRSVPs = attendees.filter(
    (a) => new Date(a.rsvpDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  ).length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Attendee Management</h2>
          <Button disabled>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
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

        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Attendee Management</h2>
          <p className="text-gray-600 mt-2">View and manage all attendees across your events.</p>
        </div>
        {hasPermission(user, "export_data") && (
          <Button onClick={handleExportAttendees} disabled={filteredAttendees.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export {selectedEvent !== "all" ? "Event" : "All"} ({filteredAttendees.length})
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttendees}</div>
            <p className="text-xs text-muted-foreground">Confirmed RSVPs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">Events with attendees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent RSVPs</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentRSVPs}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Attendees</CardTitle>
          <CardDescription>Search and filter attendees by name, email, event, or status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendees ({filteredAttendees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAttendees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No attendees found</h3>
              <p className="text-gray-600">
                {searchQuery || selectedEvent !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters."
                  : "Attendees will appear here when people RSVP to your events."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Attendee</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>RSVP Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendees.map((attendee) => (
                    <TableRow key={attendee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{getInitials(attendee.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{attendee.name}</div>
                            <div className="text-sm text-gray-500">{attendee.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/events/${attendee.eventId}`} className="text-blue-600 hover:underline">
                          {attendee.eventTitle}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={attendee.status === "confirmed" ? "default" : "secondary"}>
                          {attendee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {format(new Date(attendee.rsvpDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Link href={`/dashboard/events/${attendee.eventId}/attendees`}>
                            <Button variant="ghost" size="sm">
                              View Event
                            </Button>
                          </Link>
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
  )
}
