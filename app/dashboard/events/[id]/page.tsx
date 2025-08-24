import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EventDetails } from "@/components/events/event-details";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  return (
    <DashboardLayout>
      <EventDetails eventId={id} />
    </DashboardLayout>
  );
}
