"use client";

import { useEffect, useState } from "react";
import type { User } from "./auth";

export type Permission =
  | "manage_all_events"
  | "manage_own_events"
  | "manage_users"
  | "view_all_attendees"
  | "view_own_attendees"
  | "export_data"
  | "delete_events"
  | "create_events"
  | "edit_events";

const rolePermissions: Record<User["role"], Permission[]> = {
  ADMIN: [
    "manage_all_events",
    "manage_users",
    "view_all_attendees",
    "export_data",
    "delete_events",
    "create_events",
    "edit_events",
  ],
  STAFF: [
    "manage_all_events",
    "view_all_attendees",
    "export_data",
    "create_events",
    "edit_events",
    "delete_events",
  ],
  EVENT_OWNER: [
    "manage_own_events",
    "view_own_attendees",
    "export_data",
    "create_events",
  ],
};

export function hasPermission(
  user: User | null,
  permission: Permission
): boolean {
  if (!user) return false;
  return rolePermissions[user.role]?.includes(permission) ?? false;
}

export function canManageEvent(
  user: User | null,
  eventOwnerId?: string
): boolean {
  if (!user) return false;

  // Admins and Staff can manage all events
  if (user.role === "Admin" || user.role === "Staff") {
    return true;
  }

  // Event Owners can only manage their own events
  return user.role === "Event_Owner" && user.id === eventOwnerId;
}

/**
 * Hook to safely get the user from localStorage on the client
 */
export function useUserFromLocalStorage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored) as User);
      }
    } catch (err) {
      console.error("Failed to load user from localStorage:", err);
    }
  }, []);

  return user;
}

/**
 * Hook that returns permission helpers with the current user
 */
export function usePermissions() {
  const user = useUserFromLocalStorage();

  if(!user) {
    
  }

  return {
    user,
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    canManageEvent: (eventOwnerId?: string) =>
      canManageEvent(user, eventOwnerId),
  };
}
