import React, { useState, useEffect } from 'react';
import { Calendar, Star } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/Dialog';
import { Textarea } from '../../components/ui/Textarea';

export const UserDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { events, registrations, registerForEvent, submitFeedback } = useEvents();
  const { user } = useAuth();

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackStars, setFeedbackStars] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const registeredEventIds = new Set(registrations.map(r => r.eventId));
  const registeredEvents = events.filter(e => registeredEventIds.has(e.id));
  const defaultImage = 'https://www.shutterstock.com/image-photo/hands-typing-on-laptop-programming-600nw-2480023489.jpg';

  const handleFeedbackOpen = (eventId: number) => {
    setSelectedEventId(eventId);
    setFeedbackStars(0);
    setFeedbackMessage('');
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = () => {
    if (selectedEventId == null || feedbackStars === 0) return;
    submitFeedback({
      eventId: selectedEventId,
      stars: feedbackStars,
      message: feedbackMessage,
    });
    setShowFeedbackModal(false);
  };

  if (!activeTab || activeTab === 'dashboard') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-16 text-center bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-xl shadow-inner">
        <img
          src="https://cdn.dribbble.com/users/216295/screenshots/11862757/media/bcb2e7c45f101bc7f6304e62a44ea176.gif"
          alt="EventHub Welcome"
          className="w-[300px] h-auto mb-6 drop-shadow-xl rounded-lg"
        />
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-2 animate-fade-in">
          Hi {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-lg text-gray-700 mb-4 animate-fade-in-slow">Welcome to your Event Dashboard</p>
        <div className="text-3xl font-mono text-gray-800 animate-fade-in-slow">
          🕒 {time}
        </div>
        <p className="mt-4 text-gray-500 max-w-md animate-fade-in-slow">
          Use the sidebar to browse events, view your registrations, and share your feedback. Let's make something great today!
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-16">
      {/* Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Give Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    feedbackStars >= star ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  onClick={() => setFeedbackStars(star)}
                  fill={feedbackStars >= star ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <Textarea
              placeholder="Write your feedback here..."
              value={feedbackMessage}
              onChange={e => setFeedbackMessage(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleFeedbackSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {activeTab === 'events' && (
        <section>
          <h2 className="text-3xl font-bold mb-6">All Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => {
              const isRegistered = registeredEventIds.has(event.id);
              return (
                <Card key={event.id} hover className="relative">
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow z-10">
                    {event.eventType?.toUpperCase()}
                  </div>
                  <img
                    src={event.image || defaultImage}
                    alt={event.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{event.description}</p>
                    <div className="text-sm text-gray-600 mb-4">
                      <strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()} &ndash;{' '}
                      {new Date(event.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        className="flex-1"
                        disabled={isRegistered}
                        onClick={() => registerForEvent(event.id)}
                      >
                        {isRegistered ? 'Registered' : 'Register'}
                      </Button>
                      <Button className="flex-1" onClick={() => handleFeedbackOpen(event.id)}>
                        Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'my-events' && (
        <section>
          <h2 className="text-3xl font-bold mb-6">My Registered Events</h2>
          {registeredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredEvents.map(event => (
                <Card key={event.id}>
                  <img
                    src={event.image || defaultImage}
                    alt={event.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1 mb-2">
                      <div>
                        {new Date(event.startDate).toLocaleDateString()} &ndash;{' '}
                        {new Date(event.endDate).toLocaleDateString()}
                      </div>
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
        </section>
      )}

      {activeTab === 'profile' && (
        <section>
          <h2 className="text-3xl font-bold mb-4">Profile</h2>
          <Card className="max-w-xl">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900">Account Info</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p>
                  <strong>Name:</strong> {user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Role:</strong> {user?.role}
                </p>
                <p>
                  <strong>Member Since:</strong>{' '}
                  {new Date(user?.createdAt || '').toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};
