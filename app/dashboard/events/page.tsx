import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EventsList } from "@/components/events/events-list";

export default function EventsPage() {
  return (
    <DashboardLayout>
      <EventsList />
    </DashboardLayout>
  );
}
