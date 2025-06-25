import React, { useState, useEffect } from 'react';
import { Calendar, Star } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../contexts/AuthContext';
import { getUserByEmail } from '../../utils/api';
import { parseJwt } from '../../utils/jwtUtils';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/Dialog';
import { Textarea } from '../../components/ui/Textarea';

export const UserDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { events, registrations, registerForEvent, submitFeedback, fetchFeedbacksByEvent } = useEvents();
  const { user: authUser } = useAuth();

  const [user, setUser] = useState<any | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackStars, setFeedbackStars] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [viewDetailsEvent, setViewDetailsEvent] = useState<any | null>(null);
  const [eventFeedbacks, setEventFeedbacks] = useState<any[]>([]);
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

  const defaultImage = 'https://www.shutterstock.com/image-photo/hands-typing-on-laptop-programming-600nw-2480023489.jpg';
  const profileImage = 'https://via.placeholder.com/150';

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (activeTab === 'profile') {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = parseJwt(token);
        const email = decoded?.sub || decoded?.email;
        if (email) {
          getUserByEmail(email).then(res => {
            setUser(res.data);
          });
        }
      }
    }
  }, [activeTab]);

  const registeredEventIds = new Set(registrations.map(r => r.eventId));
  const registeredEvents = events.filter(e => registeredEventIds.has(e.id));

  const handleFeedbackOpen = (eventId: number) => {
    setSelectedEventId(eventId);
    setFeedbackStars(0);
    setFeedbackMessage('');
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = () => {
    if (selectedEventId == null || feedbackStars === 0) return;
    submitFeedback({ eventId: selectedEventId, stars: feedbackStars, message: feedbackMessage });
    setShowFeedbackModal(false);
  };

  const handleExploreFeedbacks = async (eventId: number) => {
    setSelectedEventId(eventId);
    const feedbacks = await fetchFeedbacksByEvent(eventId);
    setEventFeedbacks(feedbacks || []);
  };

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
                  className={`w-6 h-6 cursor-pointer ${feedbackStars >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                  onClick={() => setFeedbackStars(star)}
                  fill={feedbackStars >= star ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <Textarea placeholder="Write your feedback here..." value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleFeedbackSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Event Details Dialog */}
      <Dialog open={!!viewDetailsEvent} onOpenChange={() => setViewDetailsEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {viewDetailsEvent && (
            <div className="space-y-2">
              <img src={viewDetailsEvent.image || defaultImage} alt={viewDetailsEvent.name} className="w-full h-48 object-cover rounded" />
              <h3 className="text-xl font-bold">{viewDetailsEvent.name}</h3>
              <p className="text-gray-700">{viewDetailsEvent.description}</p>
              <p className="text-sm"><strong>Type:</strong> {viewDetailsEvent.eventType}</p>
              <p className="text-sm">
                <strong>Dates:</strong> {new Date(viewDetailsEvent.startDate).toLocaleDateString()} – {new Date(viewDetailsEvent.endDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dashboard */}
      {(!activeTab || activeTab === 'dashboard') && (
        <div className="flex flex-col items-center justify-center h-full p-16 text-center bg-gradient-to-br from-black-50 via-white to-blue-50 rounded-xl shadow-inner">
          <img
            src="https://i.pinimg.com/originals/cf/6f/cf/cf6fcf14be2cd01dd4923b36445ca632.gif"
            alt="EventHub Welcome"
            className="w-[300px] h-auto mb-6 drop-shadow-xl rounded-lg"
          />
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-2 animate-fade-in">
            Hi {authUser?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-lg text-gray-700 mb-4 animate-fade-in-slow">Welcome to your Event Dashboard</p>
          <div className="text-3xl font-mono text-gray-800 animate-fade-in-slow">🕒 {time}</div>
          <p className="mt-4 text-gray-500 max-w-md animate-fade-in-slow">
            Use the sidebar to browse events, view your registrations, and share your feedback. Let's make something great today!
          </p>
        </div>
      )}

      {/* Events */}
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
                  <img src={event.image || defaultImage} alt={event.name} className="w-full h-48 object-cover rounded-t-xl" />
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{event.description}</p>
                    <div className="text-sm text-gray-600 mb-4">
                      <strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()} – {new Date(event.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1" disabled={isRegistered} onClick={() => registerForEvent(event.id)}>
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

      {/* My Events */}
      {activeTab === 'my-events' && (
        <section>
          <h2 className="text-3xl font-bold mb-6">My Registered Events</h2>
          {registeredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredEvents.map(event => (
                <Card key={event.id}>
                  <img src={event.image || defaultImage} alt={event.name} className="w-full h-48 object-cover rounded-t-xl" />
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1 mb-2">
                      <div>{new Date(event.startDate).toLocaleDateString()} – {new Date(event.endDate).toLocaleDateString()}</div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setViewDetailsEvent(event)}>
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

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Explore Feedbacks</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {events.map(event => (
              <Card key={event.id} className="min-w-[280px] shadow-md">
                <img src={event.image || defaultImage} alt={event.name} className="h-32 w-full object-cover rounded-t-xl" />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{event.name}</h3>
                  <Button onClick={() => handleExploreFeedbacks(event.id)}>View Feedbacks</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {selectedEventId && (
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4">
                Feedbacks for: {events.find(e => e.id === selectedEventId)?.name}
              </h4>
              {eventFeedbacks.length > 0 ? (
                <div className="space-y-4">
                  {eventFeedbacks.map((fb, index) => (
                    <div key={index} className="border p-4 rounded bg-gray-50 shadow-sm">
                      <p className="font-medium">⭐ {fb.stars}/10</p>
                      <p className="text-gray-700">{fb.message || 'No message provided.'}</p>
                      <p className="text-sm text-gray-400">by {fb.userEmail}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No feedbacks yet for this event.</p>
              )}
            </div>
          )}
        </section>
      )}

      {/* Profile */}
      {activeTab === 'profile' && user && (
        <section>
          <h2 className="text-3xl font-bold mb-4">Profile</h2>
          <Card className="max-w-xl">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900">Account Info</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};
