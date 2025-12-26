import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";
import { getAdminSession } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getAdminSession();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      {session ? <AdminDashboard /> : <AdminLogin />}
    </div>
  );
}
