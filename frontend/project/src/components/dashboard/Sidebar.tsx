import React from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  MessageSquare, 
  User, 
  Settings, 
  PlusCircle,
  BarChart3,
  Brain,
  DollarSign,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  const userMenuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'events', icon: Calendar, label: 'Browse Events' },
    { id: 'my-events', icon: Calendar, label: 'My Events' },
    { id: 'feedback', icon: MessageSquare, label: 'Feedback' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const adminMenuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'events', icon: Calendar, label: 'All Events' },
    { id: 'create-event', icon: PlusCircle, label: 'Create Event' },
    { id: 'attendees', icon: Users, label: 'Attendees' },
    { id: 'budget', icon: DollarSign, label: 'Budget Tracker' },
    { id: 'ai-planner', icon: Brain, label: 'AI Planner' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-purple-100 h-full flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-purple-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">EventHub</h2>
            <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`
              w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-all duration-200
              ${activeTab === item.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-purple-50 hover:text-gray-900'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-purple-100">

        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};