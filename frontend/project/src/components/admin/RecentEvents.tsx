import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Event } from '@/types';
import { useRegistration } from '../../hooks/useRegistration';
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
  const { getRegistrationCount } = useRegistration();
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Events</h2>
            {onCreate && (
              <Button onClick={onCreate}>+ Create Event</Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={event.image || DEFAULT_IMAGE}
                    alt={event.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.name}</h3>
                    <p className="text-sm text-gray-600">
                      {counts[event.id] ?? 0} attendees • ₹{event.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEventId(event.id)}>
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(event)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(event.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Registration Modal */}
      {selectedEventId !== null && (
        <RegistrationModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </>
  );
};
