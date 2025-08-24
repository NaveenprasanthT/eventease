import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CreateEventForm } from "@/components/events/create-event-form"

export default function NewEventPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create New Event</h2>
          <p className="text-gray-600 mt-2">Fill in the details below to create your event.</p>
        </div>
        <CreateEventForm />
      </div>
    </DashboardLayout>
  )
}
