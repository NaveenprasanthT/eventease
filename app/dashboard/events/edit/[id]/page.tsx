import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EditEventForm } from "@/components/events/edit-event-form";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewEventPage({ params }: EventPageProps) {
  const { id } = await params;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Update Event</h2>
          <p className="text-gray-600 mt-2">
            Edit in the details below to update your event.
          </p>
        </div>
        <EditEventForm eventId={id} />
      </div>
    </DashboardLayout>
  );
}
