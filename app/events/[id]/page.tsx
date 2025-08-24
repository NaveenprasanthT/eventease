import { PublicEventDetails } from "@/components/public/public-event-details";
import { PublicHeader } from "@/components/public/public-header";

interface PublicEventPageProps {
  params: Promise<{ id: string }>; // 👈 params is async now
}

export default async function PublicEventPage({
  params,
}: PublicEventPageProps) {
  const { id } = await params; // 👈 must await

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="container mx-auto px-4 py-8">
        <PublicEventDetails eventId={id} /> {/* use awaited id */}
      </main>
    </div>
  );
}
