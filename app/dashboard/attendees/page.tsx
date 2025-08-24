import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AttendeesList } from "@/components/attendees/attendees-list"

export default function AttendeesPage() {
  return (
    <DashboardLayout>
      <AttendeesList />
    </DashboardLayout>
  )
}
