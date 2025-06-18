// src/pages/user/UserDashboard.tsx
import React from 'react';
import { Calendar } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface UserDashboardProps {
  activeTab: string;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ activeTab }) => {
  const { events, registrations, registerForEvent } = useEvents();
  const { user } = useAuth();

  const registeredEventIds = new Set(registrations.map(r => r.eventId));
  const registeredEvents = events.filter(e => registeredEventIds.has(e.id));

  const renderBrowseEvents = () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">All Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const isRegistered = registeredEventIds.has(event.id);

          return (
            <Card key={event.id} hover>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{event.description}</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="text-sm text-gray-600 mt-2">
                    <div>{event.date}</div>
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  disabled={isRegistered || event.currentAttendees >= event.maxAttendees}
                  onClick={() => registerForEvent(event.id)}
                >
                  {isRegistered ? 'Registered' : 'Register'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderMyEvents = () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">My Registered Events</h2>
      {registeredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredEvents.map(event => (
            <Card key={event.id}>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                <div className="text-sm text-gray-600 space-y-1 mb-2">
                  <div>{new Date(event.date).toLocaleDateString()} at {event.time}</div>
                  <div>{event.location}</div>
                </div>
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 py-12">
          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No events registered yet.</p>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="p-8 max-w-xl">
      <h2 className="text-3xl font-bold mb-4">Profile</h2>
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold text-gray-900">Account Info</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Member Since:</strong> {new Date(user?.createdAt || '').toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  switch (activeTab) {
    case 'my-events':
      return renderMyEvents();
    case 'profile':
      return renderProfile();
    default:
      return renderBrowseEvents();
  }
};
