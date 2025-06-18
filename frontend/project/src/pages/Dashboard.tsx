// src/pages/Dashboard.tsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { AdminDashboard } from './admin/AdminDashboard';
import { UserDashboard } from './user/UserDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') ?? user?.role.toLowerCase() ?? '';
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) return <p className="text-center p-8">Loading...</p>;

  const isAdminOrManager = roleParam === 'admin' || roleParam === 'manager';

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-6 overflow-y-auto">
        {isAdminOrManager ? (
          <AdminDashboard activeTab={activeTab} />
        ) : (
          <UserDashboard activeTab={activeTab} />
        )}
      </main>
    </div>
  );
};
