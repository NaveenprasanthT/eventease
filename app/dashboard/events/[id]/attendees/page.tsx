import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EventAttendees } from "@/components/attendees/event-attendees";

interface EventAttendeesPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventAttendeesPage({
  params,
}: EventAttendeesPageProps) {
  const { id } = await params;

  return (
    <DashboardLayout>
      <EventAttendees eventId={id} />
    </DashboardLayout>
  );
}
