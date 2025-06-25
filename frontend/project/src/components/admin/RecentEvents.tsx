import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Event } from '@/types';
import { useRegistrations } from '../../hooks/useRegistrations';
import { RegistrationModal } from './RegistrationModal';

interface RecentEventsProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: number) => void;
  onCreate?: () => void;
}

const DEFAULT_IMAGE =
  'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800';

export const RecentEvents: React.FC<RecentEventsProps> = ({
  events,
  onEdit,
  onDelete,
  onCreate,
}) => {
  const { getRegistrationCount } = useRegistrations();
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      const result: Record<number, number> = {};
      await Promise.all(
        events.map(async (event) => {
          try {
            const count = await getRegistrationCount(event.id);
            result[event.id] = count;
          } catch (err) {
            console.error(`Error fetching count for event ${event.id}`, err);
            result[event.id] = 0;
          }
        })
      );
      setCounts(result);
    };

    fetchCounts();
  }, [events]);

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-purple-100/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🕒 Recent Events
              </h2>
              <p className="text-slate-600 text-sm mt-1">Your latest created events</p>
            </div>
            {onCreate && (
              <button
                onClick={onCreate}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-200"
              >
                ✨ Create Event
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {events.slice(0, 5).map((event, index) => (
              <div
                key={event.id}
                className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  index % 3 === 0
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/30'
                    : index % 3 === 1
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/30'
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={event.image || DEFAULT_IMAGE}
                        alt={event.name}
                        className="w-14 h-14 rounded-xl object-cover shadow-md"
                      />
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                        index % 3 === 0
                          ? 'bg-blue-400'
                          : index % 3 === 1
                          ? 'bg-purple-400'
                          : 'bg-green-400'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-slate-900">
                        {event.name}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-slate-600 mt-1">
                        <span className={`px-2 py-1 rounded-lg font-medium ${
                          index % 3 === 0
                            ? 'bg-blue-200/50 text-blue-700'
                            : index % 3 === 1
                            ? 'bg-purple-200/50 text-purple-700'
                            : 'bg-green-200/50 text-green-700'
                        }`}>
                          {counts[event.id] ?? 0} attendees
                        </span>
                        <span className="font-semibold text-slate-700">₹{event.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedEventId(event.id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-700 transition-all hover:scale-110"
                      title="View registrations"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(event)}
                      className={`p-2 rounded-xl transition-all hover:scale-110 ${
                        index % 3 === 0
                          ? 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                          : index % 3 === 1
                          ? 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                          : 'bg-green-100 hover:bg-green-200 text-green-600'
                      }`}
                      title="Edit event"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(event.id)}
                      className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-all hover:scale-110"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No events yet</h3>
                <p className="text-slate-500">Create your first event to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Registration Modal */}
      {selectedEventId !== null && (
        <RegistrationModal
          eventId={selectedEventId}
          isOpen={selectedEventId !== null}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </>
  );
};