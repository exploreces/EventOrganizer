import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Event } from '@/types';

interface EventGridProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: number) => void;
}
const DEFAULT_EVENT_IMAGE = 'https://www.shutterstock.com/image-photo/hands-typing-on-laptop-programming-600nw-2480023489.jpg';

export const EventGrid: React.FC<EventGridProps> = ({ events, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} hover>
          <div className="relative">
            <img
              src={event.image || DEFAULT_EVENT_IMAGE}
              alt={event.name}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.status === 'upcoming'
                    ? 'bg-green-100 text-green-800'
                    : event.status === 'ongoing'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {event.status}
              </span>
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h3> {/* ✅ FIXED */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>
                {event.currentAttendees}/{event.maxAttendees} attendees
              </span>
              <span>${event.price}</span>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(event)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(event.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
