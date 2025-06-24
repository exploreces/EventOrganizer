// components/admin/StatsOverview.tsx
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';

export const DashboardStats  = ({ events }: { events: Event[] }) => {
  const totalAttendees = events.reduce((sum, e) => sum + e.currentAttendees, 0);
  const totalRevenue = events.reduce((sum, e) => sum + (e.currentAttendees * e.price), 0);
  const avgAttendance = events.length ? Math.round(totalAttendees / events.length) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card><CardContent className="p-6"><Stats title="Total Events" value={events.length} icon={<Calendar className="w-12 h-12 text-blue-600" />} /></CardContent></Card>
      <Card><CardContent className="p-6"><Stats title="Total Attendees" value={totalAttendees} icon={<Users className="w-12 h-12 text-green-600" />} /></CardContent></Card>
      <Card><CardContent className="p-6"><Stats title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-12 h-12 text-purple-600" />} /></CardContent></Card>
      <Card><CardContent className="p-6"><Stats title="Avg. Attendance" value={avgAttendance} icon={<TrendingUp className="w-12 h-12 text-yellow-600" />} /></CardContent></Card>
    </div>
  );
};

const Stats = ({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
    {icon}
  </div>
);
