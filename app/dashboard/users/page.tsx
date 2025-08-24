import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserManagement } from "@/components/admin/user-management";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function UsersPage() {
  return (
    <ProtectedRoute requiredPermission="manage_users">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage system users and their roles
            </p>
          </div>
          <UserManagement />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
