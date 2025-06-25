import React, { useState } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Event } from '@/types';
import { RegistrationModal } from './RegistrationModal';

interface EventGridProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: number) => void;
}

const DEFAULT_EVENT_IMAGE =
  'https://www.shutterstock.com/image-photo/hands-typing-on-laptop-programming-600nw-2480023489.jpg';

export const EventGrid: React.FC<EventGridProps> = ({ events, onEdit, onDelete }) => {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`group relative overflow-hidden rounded-3xl shadow-xl border transition-all duration-500 hover:shadow-2xl hover:scale-105 ${
              index % 4 === 0
                ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200/30'
                : index % 4 === 1
                ? 'bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200/30'
                : index % 4 === 2
                ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200/30'
                : 'bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200/30'
            }`}
          >
            {/* Image Section */}
            <div className="relative overflow-hidden">
              <img
                src={event.image || DEFAULT_EVENT_IMAGE}
                alt={event.name}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                  event.status === 'upcoming'
                    ? 'bg-green-400/90 text-white'
                    : event.status === 'ongoing'
                    ? 'bg-blue-400/90 text-white'
                    : 'bg-gray-400/90 text-white'
                }`}>
                  {event.status?.toUpperCase() || 'AS'}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-slate-900">
                  {event.name}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-xl text-xs font-medium ${
                  index % 4 === 0
                    ? 'bg-blue-200/50 text-blue-700'
                    : index % 4 === 1
                    ? 'bg-purple-200/50 text-purple-700'
                    : index % 4 === 2
                    ? 'bg-green-200/50 text-green-700'
                    : 'bg-yellow-200/50 text-yellow-700'
                }`}>
                  {event.currentAttendees}/{event.maxAttendees} attendees
                </div>
                <div className="text-lg font-bold text-slate-700">₹{event.price}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => onEdit(event)}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
                    index % 4 === 0
                      ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                      : index % 4 === 1
                      ? 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20'
                      : index % 4 === 2
                      ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20'
                  }`}
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Edit
                </button>

                <button
                  onClick={() => onDelete(event.id)}
                  className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all hover:scale-110"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedEventId(event.id)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all hover:scale-110"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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