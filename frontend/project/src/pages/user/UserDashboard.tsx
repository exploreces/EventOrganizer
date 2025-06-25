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
  const profileImage = 'https://images.unsplash.com/photo-1527752002957-af97f18a0c81?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D/100'
;

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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-sky-50 p-8 space-y-16">
      {/* Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 rounded-3xl shadow-2xl backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text text-center">
              ✨ Share Your Experience
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer transition-all duration-200 hover:scale-110 ${
                    feedbackStars >= star ? 'text-yellow-400 drop-shadow-lg' : 'text-gray-300'
                  }`}
                  onClick={() => setFeedbackStars(star)}
                  fill={feedbackStars >= star ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <Textarea
              placeholder="Tell us about your experience... 💭"
              value={feedbackMessage}
              onChange={e => setFeedbackMessage(e.target.value)}
              className="bg-white/80 border-2 border-purple-200 rounded-2xl p-4 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleFeedbackSubmit}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              ✨ Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Event Details Dialog */}
      <Dialog open={!!viewDetailsEvent} onOpenChange={() => setViewDetailsEvent(null)}>
        <DialogContent className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-3xl shadow-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text text-center">
              🎪 Event Details
            </DialogTitle>
          </DialogHeader>
          {viewDetailsEvent && (
            <div className="space-y-4 p-4">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={viewDetailsEvent.image || defaultImage}
                  alt={viewDetailsEvent.name}
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">{viewDetailsEvent.name}</h3>
                <p className="text-gray-700 leading-relaxed">{viewDetailsEvent.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                    📝 {viewDetailsEvent.eventType}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    📅 {new Date(viewDetailsEvent.startDate).toLocaleDateString()} – {new Date(viewDetailsEvent.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dashboard */}
      {(!activeTab || activeTab === 'dashboard') && (
        <div className="flex flex-col items-center justify-center h-full p-16 text-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-sm">
          <div className="relative">
            <img
              src="https://i.pinimg.com/originals/cf/6f/cf/cf6fcf14be2cd01dd4923b36445ca632.gif"
              alt="EventHub Welcome"
              className="w-[300px] h-auto mb-6 drop-shadow-2xl rounded-2xl border-4 border-white/50"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
          </div>
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mb-4 drop-shadow-sm">
            Hi {authUser?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-xl text-gray-700 mb-6 font-medium">Welcome to your magical Event Dashboard ✨</p>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200">
            <div className="text-4xl font-mono text-gray-800 mb-2">🕒 {time}</div>
            <p className="text-purple-600 font-semibold">Live Time</p>
          </div>
          <p className="mt-8 text-gray-600 max-w-lg leading-relaxed bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md">
            🎪 Use the sidebar to browse events, view your registrations, and share your feedback. Let's make something amazing together! 🌟
          </p>
        </div>
      )}

      {/* Events */}
      {activeTab === 'events' && (
        <section className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text text-center">
            🎪 Discover Amazing Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => {
              const isRegistered = registeredEventIds.has(event.id);
              return (
                <Card key={event.id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-200 transform hover:scale-105 overflow-hidden">
                  <div className="relative">
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-10 backdrop-blur-sm">
                      ✨ {event.eventType?.toUpperCase()}
                    </div>
                    <img
                      src={event.image || defaultImage}
                      alt={event.name}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
                    <p className="text-gray-600 line-clamp-2 leading-relaxed">{event.description}</p>
                    <div className="bg-purple-50 rounded-2xl p-3 border border-purple-100">
                      <p className="text-sm text-purple-700 font-semibold">
                        📅 {new Date(event.startDate).toLocaleDateString()} – {new Date(event.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <Button
                        className={`flex-1 font-semibold py-3 rounded-2xl transition-all duration-200 ${
                          isRegistered
                            ? 'bg-green-100 text-green-700 border-2 border-green-200 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        }`}
                        disabled={isRegistered}
                        onClick={() => registerForEvent(event.id)}
                      >
                        {isRegistered ? '✅ Registered' : '🎯 Register'}
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        onClick={() => handleFeedbackOpen(event.id)}
                      >
                        💭 Feedback
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
        <section className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text text-center">
            🎫 My Registered Events
          </h2>
          {registeredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {registeredEvents.map(event => (
                <Card key={event.id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-green-100 hover:border-green-200 transform hover:scale-105 transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={event.image || defaultImage}
                      alt={event.name}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white p-2 rounded-full shadow-lg">
                      ✅
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                    <div className="bg-green-50 rounded-2xl p-3 border border-green-100">
                      <p className="text-sm text-green-700 font-semibold">
                        📅 {new Date(event.startDate).toLocaleDateString()} – {new Date(event.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 hover:border-blue-300 text-blue-700 font-semibold py-3 rounded-2xl transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                      onClick={() => setViewDetailsEvent(event)}
                    >
                      👀 View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-200">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-purple-300" />
              <p className="text-xl text-gray-600 font-medium">No events registered yet 🎪</p>
              <p className="text-gray-500 mt-2">Start exploring and join amazing events!</p>
            </div>
          )}
        </section>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <section className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text text-center">
            💬 Explore Community Feedback
          </h2>
          <div className="flex overflow-x-auto space-x-6 pb-6 scrollbar-hide">
            {events.map(event => (
              <Card key={event.id} className="min-w-[300px] bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border-2 border-orange-100 hover:border-orange-200 transform hover:scale-105 transition-all duration-300 overflow-hidden flex-shrink-0">
                <div className="relative">
                  <img
                    src={event.image || defaultImage}
                    alt={event.name}
                    className="h-36 w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-lg text-gray-900">{event.name}</h3>
                  <Button
                    onClick={() => handleExploreFeedbacks(event.id)}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    🔍 View Feedbacks
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {selectedEventId && (
            <div className="mt-10 bg-white/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-purple-100">
              <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                💭 Feedbacks for: {events.find(e => e.id === selectedEventId)?.name}
              </h4>
              {eventFeedbacks.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {eventFeedbacks.map((fb, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">⭐</span>
                          <span className="font-bold text-yellow-600 text-lg">{fb.stars}/5</span>
                        </div>
                        <span className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full font-medium">
                          {fb.userEmail}
                        </span>
                      </div>
                      <p className="text-gray-700 italic leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        "{fb.message || 'No message provided.'}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/50 rounded-3xl border-2 border-dashed border-purple-200">
                  <p className="text-xl text-gray-500 font-medium">No feedbacks yet for this event 💭</p>
                  <p className="text-gray-400 mt-2">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Profile */}
      {activeTab === 'profile' && user && (
        <section className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text text-center">
            👤 My Profile
          </h2>
          <div className="flex justify-center">
            <Card className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-indigo-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 p-8">
                <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-700 to-purple-700 text-transparent bg-clip-text">
                  🌟 Account Information
                </h3>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                  <div className="relative">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white shadow-2xl"
                    />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      ✨
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                      <span className="font-bold text-indigo-600">👤 Name:</span>
                      <span className="ml-2 text-gray-800 font-semibold">{user.name}</span>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                      <span className="font-bold text-purple-600">📧 Email:</span>
                      <span className="ml-2 text-gray-800 font-semibold">{user.email}</span>
                    </div>
                    <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
                      <span className="font-bold text-pink-600">🏷️ Role:</span>
                      <span className="ml-2 text-gray-800 font-semibold">{user.role}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};