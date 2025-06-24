import React, { useEffect, useState } from 'react';
import { useEvents, Event } from '../../hooks/useEvents';
import { useAuth } from '../../contexts/AuthContext';

// Modular Components
import { DashboardStats } from '../../components/admin/StatsOverview';
import { RecentEvents } from '../../components/admin/RecentEvents';
import { EventGrid } from '../../components/admin/EventGrid';
import { EventForm } from '../../components/admin/EventForm';
import { AIPlanner } from '../../components/admin/AIPlanner';
import { BudgetTracker } from '../../components/admin/BudgetTracker';

interface AdminDashboardProps {
  activeTab: string;
}

const DEFAULT_EVENT_IMAGE =
  'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
  const { events, createEvent, updateEvent, deleteEvent } = useEvents();
  const { user } = useAuth();

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getInitialFormData = (): Omit<Event, 'id'> => ({
    name: '',
    description: '',
    eventType: 'CONFERENCE',
    startDate: '',
    endDate: '',
    image: DEFAULT_EVENT_IMAGE,
  });

  const [eventForm, setEventForm] = useState<Omit<Event, 'id'>>(getInitialFormData());

  const handleFormChange = (key: keyof typeof eventForm, value: any) => {
    if (key === 'eventType') {
      value = value.toUpperCase();
    }
    setEventForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventForm);
      } else {
        await createEvent(eventForm);
      }
      resetFormAndClose();
    } catch (err) {
      console.error('Event submission failed:', err);
    }
  };

  const resetFormAndClose = () => {
    setEventForm(getInitialFormData());
    setEditingEvent(null);
    setShowCreateForm(false);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      name: event.name,
      description: event.description,
      eventType: event.eventType,
      startDate: event.startDate,
      endDate: event.endDate,
      image: event.image,
    });
    setShowCreateForm(true);
  };

  const handleCreateNew = () => {
    setEventForm(getInitialFormData());
    setEditingEvent(null);
    setShowCreateForm(true);
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EventForm
          formData={eventForm}
          isEditing={!!editingEvent}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          onCancel={resetFormAndClose}
        />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <DashboardStats events={events} />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <RecentEvents
                events={events}
                onEdit={handleEditEvent}
                onDelete={deleteEvent}
                onCreate={handleCreateNew}
              />
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Events</h1>
                <p className="text-gray-600 mt-1">Manage and organize your events</p>
              </div>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Event
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <EventGrid events={events} onEdit={handleEditEvent} onDelete={deleteEvent} />
            </div>
          </div>
        );

      case 'ai-planner':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <AIPlanner />
          </div>
        );

      case 'budget':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <BudgetTracker events={events} />
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <DashboardStats events={events} />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <RecentEvents
                events={events}
                onEdit={handleEditEvent}
                onDelete={deleteEvent}
                onCreate={handleCreateNew}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">{renderTabContent()}</div>
    </div>
  );
};
