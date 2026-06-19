import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950">
      <AdminSidebar />
      <div className="ml-64">
        <AdminHeader />
        <main className="pt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
