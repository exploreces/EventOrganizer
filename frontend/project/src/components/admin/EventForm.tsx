import React, { FormEvent } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Event } from '../../hooks/useEvents';

interface EventFormProps {
  formData: Omit<Event, 'id'>;
  isEditing: boolean;
  onChange: (key: keyof EventFormProps['formData'], value: any) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  formData,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditing ? 'Edit Event' : 'Create New Event'}
        </h1>
        <p className="text-gray-600">Fill in the details to create or update an event.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              label="Event Name"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => onChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => onChange('eventType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
               <option value="CLUB">CLUB</option>
                 <option value="CONFERENCE">CONFERENCE</option>
                 <option value="WORKSHOP">WORKSHOP</option>
                 <option value="SEMINAR">SEMINAR</option>
                 <option value="TRAINING">TRAINING</option>
                 <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => onChange('startDate', e.target.value)}
                required
              />
              <Input
                label="End Date"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => onChange('endDate', e.target.value)}
                required
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1">
                {isEditing ? 'Update Event' : 'Create Event'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};