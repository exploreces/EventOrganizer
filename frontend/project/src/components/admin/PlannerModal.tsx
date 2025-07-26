// src/components/admin/PlannerModal.tsx
import React, { useState, useEffect } from 'react';
import { Eye, DollarSign, Bot } from 'lucide-react';
import BudgetModal from './BudgetModal';
import AiModal from './AiModal';
import api from '../../utils/api';

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  description?: string;
}

const PlannerModal: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
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
    fetchEvents();
  }, []);

  const handleBudgetPlanner = (event: Event) => {
    setSelectedEvent(event);
    setShowBudgetModal(true);
  };

  const handleAiPlanner = (event: Event) => {
    setSelectedEvent(event);
    setShowAiModal(true);
  };

  return (
    <div className="p-6 md:p-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Event Planner</h2>

      {loading && <p className="text-gray-500">Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && events.length === 0 && !error && (
        <p className="text-gray-600">No events found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
          >
            <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{event.date}</p>
            <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => handleBudgetPlanner(event)}
                className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
              >
                <DollarSign size={16} />
                Budget
              </button>

              <button
                onClick={() => handleAiPlanner(event)}
                className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
              >
                <Bot size={16} />
                AI Notes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Budget & AI modals remain as actual modals */}
      {selectedEvent && (
        <>
          <BudgetModal
            isOpen={showBudgetModal}
            onClose={() => setShowBudgetModal(false)}
            eventId={selectedEvent.id}
          />
          <AiModal
            isOpen={showAiModal}
            onClose={() => setShowAiModal(false)}
            eventId={selectedEvent.id}
          />
        </>
      )}
    </div>
  );
};

export default PlannerModal;
