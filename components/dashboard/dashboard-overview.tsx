"use client";

// import { useAuth } from "@/lib/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { User } from "@/lib/auth";
import { usePermissions } from "@/lib/permissions";
import { useEffect, useState } from "react";
import { dashboardApi } from "@/utils/api/dashboard";

interface StatsData {
  events: number;
  totalAttendees: number;
  upcomingEvents: number;
  growthPercentage: number;
}

export function DashboardOverview() {
  const { user } = usePermissions();

  const [stats, setStats] = useState<StatsData>({
    events: 0,
    totalAttendees: 0,
    upcomingEvents: 0,
    growthPercentage: 0,
  });

  useEffect(() => {
    async function getCardDetails() {
      try {
        const response: any = await dashboardApi.getCards();
        setStats(response);
      } catch (err) {
        console.log(err);
      }
    }
    getCardDetails();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your events today.
          </p>
        </div>
        <Link href="/dashboard/events/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.events}</div>
            <p className="text-xs text-muted-foreground">
              All time events created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Attendees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendees}</div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.growthPercentage}%</div>
            <p className="text-xs text-muted-foreground">From last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/events/new">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 bg-transparent"
              >
                <Plus className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Create New Event</div>
                  <div className="text-sm text-muted-foreground">
                    Set up your next event
                  </div>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/events">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 bg-transparent"
              >
                <Calendar className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Manage Events</div>
                  <div className="text-sm text-muted-foreground">
                    View and edit your events
                  </div>
                </div>
              </Button>
            </Link>

            {/* <Link href="/dashboard/attendees">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 bg-transparent"
              >
                <Users className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">View Attendees</div>
                  <div className="text-sm text-muted-foreground">
                    Manage your guest lists
                  </div>
                </div>
              </Button>
            </Link> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
