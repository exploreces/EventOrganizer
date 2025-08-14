import React, { useEffect, useState } from 'react';
import { useEvents, Event } from '../../hooks/useEvents';
import { Calendar } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { getUserByEmail } from '../../utils/api'; // ✅ Added for profile fetch
import api from '../../utils/api';

// Modular Components
import { DashboardStats } from '../../components/admin/StatsOverview';
import { RecentEvents } from '../../components/admin/RecentEvents';
import { EventGrid } from '../../components/admin/EventGrid';
import { EventForm } from '../../components/admin/EventForm';
import { AIPlanner } from '../../components/admin/AIPlanner';
import { BudgetTracker } from '../../components/admin/BudgetTracker';
import { FeedbackModal } from '../../components/admin/FeedbackModal';
import PlannerModal from '../../components/admin/PlannerModal';


interface AdminDashboardProps {
  activeTab: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

const DEFAULT_EVENT_IMAGE =
  'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
  const { events, createEvent, updateEvent, deleteEvent } = useEvents();
  const { user } = useAuth();

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [feedbackEventId, setFeedbackEventId] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // ✅ For profile tab

  // ✅ Add state variables for each modal type
  const [aiPlannerEventId, setAiPlannerEventId] = useState<number | null>(null);
  const [budgetEventId, setBudgetEventId] = useState<number | null>(null);
  const [plannerEventId, setPlannerEventId] = useState<number | null>(null);

  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);

  const getInitialFormData = (): Omit<Event, 'id'> => ({
    name: '',
    description: '',
    eventType: 'CLUB',
    startDate: '',
    endDate: '',
    image: DEFAULT_EVENT_IMAGE,
  });

  const [eventForm, setEventForm] = useState<Omit<Event, 'id'>>(getInitialFormData());

  // ✅ Added: Functions to handle PlannerModal
  const openPlannerModal = () => setIsPlannerModalOpen(true);
  const closePlannerModal = () => setIsPlannerModalOpen(false);

  // ✅ Added: Functions to close the other modals
  const closeAiPlanner = () => setAiPlannerEventId(null);
  const closeBudget = () => setBudgetEventId(null);
  const closePlanner = () => setPlannerEventId(null);

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

  const parseJwt = (token: string): any => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Failed to parse JWT:', e);
      return null;
    }
  };

  useEffect(() => {
    if (activeTab === 'profile') {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = parseJwt(token);
        const email = decoded?.sub || decoded?.email;
        if (email) {
          getUserByEmail(email)
            .then(res => setUserProfile(res.data))
            .catch(err => console.error('Failed to fetch user profile:', err));
        }
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'my-events' && isPlannerModalOpen) {
      closePlannerModal();
    }
  }, [activeTab, isPlannerModalOpen]);

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
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      case 'profile':
        return (
          <div className="relative overflow-hidden rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6 bg-pink-50 animate-gradient-slow">
            {/* Background gradient animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 opacity-60 blur-2xl animate-gradient-slow z-0"></div>

            {/* Profile content */}
            <div className="relative z-10 flex items-center gap-6">
              <img
                src="https://images.unsplash.com/photo-1527752002957-af97f18a0c81?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D/100"
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              />
              <div className="text-gray-800 space-y-2">
                <h2 className="text-3xl font-semibold text-pink-700 mb-2">My Profile</h2>
                {userProfile ? (
                  <div className="space-y-1 text-lg">
                    <p><span className="font-medium text-pink-600">Name:</span> {userProfile.name}</p>
                    <p><span className="font-medium text-pink-600">Email:</span> {userProfile.email}</p>
                    <p><span className="font-medium text-pink-600">Role:</span> {userProfile.role}</p>
                  </div>
                ) : (
                  <p className="text-pink-500">Loading profile...</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'my-events':
        return (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">My Events</h2>
                  <p className="text-gray-600">Manage your events with AI assistance, budget tracking, and notes</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Plans</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {events.filter(e => new Date(e.endDate) > new Date()).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">AI Suggestions</p>
                    <p className="text-2xl font-bold text-gray-900">Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Events List */}
            {events.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">My Events</h3>
                  <p className="text-gray-600 mt-1">Manage your events with AI assistance, budget tracking, and notes</p>
                </div>

                <div className="divide-y divide-gray-200">
                  {events.map((event) => (
                    <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Event Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={event.image || DEFAULT_EVENT_IMAGE}
                            alt={event.name}
                            className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg object-cover shadow-md"
                          />
                        </div>

                        {/* Event Details */}
                        <div className="flex-grow space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">{event.name}</h4>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-1">
                                {event.eventType}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center mb-1">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>Start: {new Date(event.startDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>End: {new Date(event.endDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm leading-relaxed">
                            {event.description}
                          </p>

                          {/* Action Buttons - UPDATED with functionality */}
                          <div className="flex flex-wrap gap-3 pt-2">
                            <button
                              onClick={() => setAiPlannerEventId(event.id)}
                              className="inline-flex items-center px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium rounded-lg transition-colors duration-200 text-sm"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              AI Suggestions
                            </button>

                            <button
                              onClick={() => setBudgetEventId(event.id)}
                              className="inline-flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 font-medium rounded-lg transition-colors duration-200 text-sm"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              Budget
                            </button>

                            <button
                              onClick={() => setPlannerEventId(event.id)}
                              className="inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium rounded-lg transition-colors duration-200 text-sm"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Notes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {events.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start planning your first event! Create an event and use our AI-powered tools to make it amazing.
                </p>
                <button
                  onClick={handleCreateNew}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create Your First Event
                </button>
              </div>
            )}
          </div>
        );

      case 'budget':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <BudgetTracker events={events} />
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-8 p-6">
            {/* Header Section */}
            <div className="text-center">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                ✨ Event Feedbacks
              </h2>
              <p className="text-slate-600 text-lg">Discover what participants thought about your events</p>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mx-auto mt-4"></div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`group relative overflow-hidden rounded-3xl p-6 shadow-lg border transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer ${
                    index % 4 === 0
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200/50 hover:from-blue-100 hover:to-indigo-150'
                      : index % 4 === 1
                      ? 'bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200/50 hover:from-purple-100 hover:to-pink-150'
                      : index % 4 === 2
                      ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200/50 hover:from-green-100 hover:to-emerald-150'
                      : 'bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200/50 hover:from-yellow-100 hover:to-orange-150'
                  }`}
                >
                  {/* Decorative Elements */}
                  <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 ${
                    index % 4 === 0
                      ? 'bg-gradient-to-br from-blue-300 to-indigo-300'
                      : index % 4 === 1
                      ? 'bg-gradient-to-br from-purple-300 to-pink-300'
                      : index % 4 === 2
                      ? 'bg-gradient-to-br from-green-300 to-emerald-300'
                      : 'bg-gradient-to-br from-yellow-300 to-orange-300'
                  }`}></div>
                  <div className={`absolute -bottom-2 -left-2 w-8 h-8 rounded-full opacity-30 ${
                    index % 4 === 0
                      ? 'bg-gradient-to-br from-blue-400 to-indigo-400'
                      : index % 4 === 1
                      ? 'bg-gradient-to-br from-purple-400 to-pink-400'
                      : index % 4 === 2
                      ? 'bg-gradient-to-br from-green-400 to-emerald-400'
                      : 'bg-gradient-to-br from-yellow-400 to-orange-400'
                  }`}></div>

                  {/* Event Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                    index % 4 === 0
                      ? 'bg-gradient-to-r from-blue-400 to-indigo-400'
                      : index % 4 === 1
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                      : index % 4 === 2
                      ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                      : 'bg-gradient-to-r from-yellow-400 to-orange-400'
                  }`}>
                    <span className="text-white text-xl font-bold">
                      {event.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Event Content */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-xl text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-2">
                      {event.name}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {event.description}
                    </p>

                    {/* Stats or Badge */}
                    <div className="flex items-center space-x-2 pt-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        index % 4 === 0
                          ? 'bg-blue-200/50 text-blue-700'
                          : index % 4 === 1
                          ? 'bg-purple-200/50 text-purple-700'
                          : index % 4 === 2
                          ? 'bg-green-200/50 text-green-700'
                          : 'bg-yellow-200/50 text-yellow-700'
                      }`}>
                        Event #{event.id}
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Feedback Ready
                      </div>
                    </div>
                  </div>

                  {/* View Feedbacks Button */}
                  <button
                    onClick={() => setFeedbackEventId(event.id)}
                    className={`mt-6 w-full py-3 px-4 rounded-2xl font-medium text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 shadow-lg hover:shadow-xl ${
                      index % 4 === 0
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:ring-blue-200'
                        : index % 4 === 1
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:ring-purple-200'
                        : index % 4 === 2
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 focus:ring-green-200'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:ring-yellow-200'
                    }`}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View Feedbacks</span>
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {events.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                  <span className="text-4xl">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Events Found</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Create your first event to start collecting valuable feedback from participants.
                </p>
              </div>
            )}

            {/* Feedback Modal */}
            {feedbackEventId !== null && (
              <FeedbackModal
                eventId={feedbackEventId}
                isOpen={feedbackEventId !== null}
                onClose={() => setFeedbackEventId(null)}
              />
            )}
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
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-8">{renderTabContent()}</div>
      </div>

      {/* Modal Components - Added here */}
      {aiPlannerEventId !== null && (
        <AIPlanner
          eventId={aiPlannerEventId}
          isOpen={true}
          onClose={closeAiPlanner}
        />
      )}

      {budgetEventId !== null && (
        <BudgetTracker
          eventId={budgetEventId}
          isOpen={true}
          onClose={closeBudget}
        />
      )}

      {plannerEventId !== null && (
        <PlannerModal
          eventId={plannerEventId}
          isOpen={true}
          onClose={closePlanner}
        />
      )}

      {/* Keep existing feedback modal */}
      {feedbackEventId !== null && (
        <FeedbackModal
          eventId={feedbackEventId}
          isOpen={feedbackEventId !== null}
          onClose={() => setFeedbackEventId(null)}
        />
      )}
    </>
  );
};