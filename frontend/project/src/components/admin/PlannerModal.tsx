import React, { useState, useEffect } from 'react';
import { X, Eye, DollarSign, Bot } from 'lucide-react';
import BudgetModal from './BudgetModal';
import AiModal from './AiModal';
import api from '../../utils/api'; // Add your API import

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  description?: string;
}

interface PlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlannerModal: React.FC<PlannerModalProps> = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/events');
      setEvents(response.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen]);

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleBudgetPlanner = (event: Event) => {
    setSelectedEvent(event);
    setShowBudgetModal(true);
  };

  const handleAiPlanner = (event: Event) => {
    setSelectedEvent(event);
    setShowAiModal(true);
  };

  const closeAllModals = () => {
    setShowBudgetModal(false);
    setShowAiModal(false);
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Event Planner</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading events...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-40 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchEvents}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-700">Your Events</h3>
                <span className="text-sm text-gray-500">
                  {events.length} {events.length === 1 ? 'event' : 'events'}
                </span>
              </div>

              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-6 min-w-max">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 min-w-[320px] border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
                    >
                      <div className="mb-4">
                        <h4 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600 font-medium mb-1">
                          📅 {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        {event.location && (
                          <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                            📍 {event.location}
                          </p>
                        )}
                        {event.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                            {event.description}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-center space-x-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleViewDetails(event)}
                          className="flex items-center justify-center w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-full transition-all duration-200 hover:scale-105 group"
                          title="View Details"
                        >
                          <Eye size={18} className="text-blue-600 group-hover:text-blue-700" />
                        </button>

                        <button
                          onClick={() => handleBudgetPlanner(event)}
                          className="flex items-center justify-center w-10 h-10 bg-green-50 hover:bg-green-100 rounded-full transition-all duration-200 hover:scale-105 group"
                          title="Budget Planner"
                        >
                          <DollarSign size={18} className="text-green-600 group-hover:text-green-700" />
                        </button>

                        <button
                          onClick={() => handleAiPlanner(event)}
                          className="flex items-center justify-center w-10 h-10 bg-purple-50 hover:bg-purple-100 rounded-full transition-all duration-200 hover:scale-105 group"
                          title="AI Planner"
                        >
                          <Bot size={18} className="text-purple-600 group-hover:text-purple-700" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {events.length === 0 && !loading && !error && (
                <div className="text-center py-16">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bot size={32} className="text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">No Events Found</h4>
                    <p className="text-gray-500">Create your first event to get started with planning!</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Event Details</h3>
              <button
                onClick={closeAllModals}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{selectedEvent.title}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">
                  {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {selectedEvent.location && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{selectedEvent.location}</p>
                </div>
              )}

              {selectedEvent.description && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded whitespace-pre-wrap">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeAllModals}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {showBudgetModal && selectedEvent && (
        <BudgetModal
          isOpen={showBudgetModal}
          onClose={closeAllModals}
          event={selectedEvent}
        />
      )}

      {/* AI Modal */}
      {showAiModal && selectedEvent && (
        <AiModal
          isOpen={showAiModal}
          onClose={closeAllModals}
          event={selectedEvent}
        />
      )}
    </>
  );
};

export default PlannerModal;