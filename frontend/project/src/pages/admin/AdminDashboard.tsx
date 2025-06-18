import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Brain,
  BarChart3
} from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Event } from '../../types';

interface AdminDashboardProps {
  activeTab: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
  const { events, createEvent, updateEvent, deleteEvent } = useEvents();
  const { user } = useAuth();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    maxAttendees: 100,
    price: 0,
    image: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: user?.name || '',
    status: 'upcoming' as const,
  });

  const totalAttendees = events.reduce((sum, event) => sum + event.currentAttendees, 0);
  const totalRevenue = events.reduce((sum, event) => sum + (event.currentAttendees * event.price), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent(editingEvent.id, eventForm);
      setEditingEvent(null);
    } else {
      createEvent(eventForm);
      setShowCreateForm(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: '',
      maxAttendees: 100,
      price: 0,
      image: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800',
      organizer: user?.name || '',
      status: 'upcoming',
    });
  };

  const startEdit = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      maxAttendees: event.maxAttendees,
      price: event.price,
      image: event.image,
      organizer: event.organizer,
      status: event.status,
    });
    setShowCreateForm(true);
  };

  const renderDashboard = () => (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Manage your events and track performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{events.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                <p className="text-3xl font-bold text-gray-900">{totalAttendees}</p>
              </div>
              <Users className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Attendance</p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.length > 0 ? Math.round(totalAttendees / events.length) : 0}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Events</h2>
            <Button onClick={() => setShowCreateForm(true)} icon={Plus}>
              Create Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {event.currentAttendees}/{event.maxAttendees} attendees • ${event.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(event)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteEvent(event.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEvents = () => (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Events</h1>
          <p className="text-gray-600">Manage your event portfolio.</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} icon={Plus}>
          Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} hover>
            <div className="relative">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                  event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{event.currentAttendees}/{event.maxAttendees} attendees</span>
                <span>${event.price}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => startEdit(event)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteEvent(event.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCreateEvent = () => (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {editingEvent ? 'Edit Event' : 'Create New Event'}
        </h1>
        <p className="text-gray-600">Fill in the details to create or update an event.</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Event Title"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                  required
                />
                <Input
                  label="Time"
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                  required
                />
              </div>

              <Input
                label="Location"
                value={eventForm.location}
                onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Category"
                  value={eventForm.category}
                  onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                  required
                />
                <Input
                  label="Max Attendees"
                  type="number"
                  value={eventForm.maxAttendees}
                  onChange={(e) => setEventForm({...eventForm, maxAttendees: parseInt(e.target.value)})}
                  required
                />
              </div>

              <Input
                label="Price ($)"
                type="number"
                step="0.01"
                value={eventForm.price}
                onChange={(e) => setEventForm({...eventForm, price: parseFloat(e.target.value)})}
                required
              />

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingEvent(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAIPlanner = () => (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Event Planner</h1>
        <p className="text-gray-600">Get intelligent suggestions for your event planning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-purple-600" />
              Planning Assistant
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Smart Venue Suggestions</h3>
              <p className="text-gray-600 text-sm">
                Based on your event type and expected attendance, here are optimal venues:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-700">
                <li>• Convention Center (500+ capacity)</li>
                <li>• Hotel Conference Room (100-300 capacity)</li>
                <li>• Outdoor Pavilion (200-400 capacity)</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Budget Optimization</h3>
              <p className="text-gray-600 text-sm">
                Recommended budget allocation for a 300-person tech conference:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-700">
                <li>• Venue: 40% ($12,000)</li>
                <li>• Catering: 30% ($9,000)</li>
                <li>• A/V Equipment: 15% ($4,500)</li>
                <li>• Marketing: 15% ($4,500)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Event Timeline Generator</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                <div>
                  <p className="font-medium text-gray-900">8 Weeks Before</p>
                  <p className="text-sm text-gray-600">Book venue, send save-the-dates</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                <div>
                  <p className="font-medium text-gray-900">6 Weeks Before</p>
                  <p className="text-sm text-gray-600">Confirm speakers, open registration</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                <div>
                  <p className="font-medium text-gray-900">4 Weeks Before</p>
                  <p className="text-sm text-gray-600">Finalize catering, A/V setup</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                <div>
                  <p className="font-medium text-gray-900">2 Weeks Before</p>
                  <p className="text-sm text-gray-600">Send final details to attendees</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-green-600 rounded-full mt-1"></div>
                <div>
                  <p className="font-medium text-gray-900">Event Day</p>
                  <p className="text-sm text-gray-600">Execute your perfect event!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBudget = () => (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Tracker</h1>
        <p className="text-gray-600">Monitor expenses and budget allocation across events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Budget Overview</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budgeted</span>
                        <span className="font-medium">${(event.price * event.maxAttendees * 0.8).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Actual Revenue</span>
                        <span className="font-medium text-green-600">${(event.price * event.currentAttendees).toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((event.currentAttendees / event.maxAttendees) * 100)}% of target reached
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Total Financial Overview</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-700">${totalRevenue.toLocaleString()}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Projected Revenue</p>
                <p className="text-2xl font-bold text-blue-700">
                  ${events.reduce((sum, event) => sum + (event.price * event.maxAttendees), 0).toLocaleString()}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Average Ticket Price</p>
                <p className="text-2xl font-bold text-purple-700">
                  ${events.length > 0 ? Math.round(events.reduce((sum, event) => sum + event.price, 0) / events.length) : 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  if (showCreateForm) {
    return renderCreateEvent();
  }

  switch (activeTab) {
    case 'dashboard':
      return renderDashboard();
    case 'events':
      return renderEvents();
    case 'create-event':
      return renderCreateEvent();
    case 'ai-planner':
      return renderAIPlanner();
    case 'budget':
      return renderBudget();
    default:
      return renderDashboard();
  }
};