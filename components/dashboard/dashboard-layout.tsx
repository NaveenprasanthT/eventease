"use client";

import type React from "react";
import { usePermissions } from "@/lib/permissions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, LogOut, Plus, Users } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, hasPermission } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      try {
        const { data: userData } = await authClient.getSession();

        if (userData?.user) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: userData.user.id,
              email: userData.user.email,
              name: userData.user.name,
              role: userData.user.role,
            })
          );
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Session fetch failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSession();
  }, [router]);

  // ✅ While checking session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ If no user after session check
  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    localStorage.removeItem("user");
    await authClient.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">EventEase</h1>
              </Link>
              <nav className="hidden md:flex items-center space-x-6 ml-8">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/events"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  {hasPermission("manage_all_events")
                    ? "All Events"
                    : "My Events"}
                </Link>
                {hasPermission("manage_users") && (
                  <Link
                    href="/dashboard/users"
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    <Users className="h-4 w-4 inline mr-1" />
                    Users
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {hasPermission("create_events") && (
                <Link href="/dashboard/events/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                  </Button>
                </Link>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{user.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    user.role === "Admin"
                      ? "bg-red-100 text-red-800"
                      : user.role === "Staff"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
