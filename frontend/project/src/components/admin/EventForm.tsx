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
    <div className="p-8 max-w-2xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 min-h-screen">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          {isEditing ? '✏️ Edit Event' : '✨ Create New Event'}
        </h1>
        <p className="text-slate-600">Fill in the details to create or update an event.</p>
        <div className="h-1 w-16 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mx-auto mt-4"></div>
      </div>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50 overflow-hidden">
        <div className="p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Event Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Event Name</label>
              <input
                value={formData.name}
                onChange={(e) => onChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-purple-50/50 border border-purple-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200/50 focus:border-purple-400 transition-all"
                required
                placeholder="Enter event name..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => onChange('description', e.target.value)}
                className="w-full px-4 py-3 bg-purple-50/50 border border-purple-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200/50 focus:border-purple-400 transition-all resize-none"
                rows={4}
                required
                placeholder="Describe your event..."
              />
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => onChange('eventType', e.target.value)}
                className="w-full px-4 py-3 bg-purple-50/50 border border-purple-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200/50 focus:border-purple-400 transition-all"
                required
              >
                <option value="CLUB">🎭 CLUB</option>
                <option value="CONFERENCE">🎯 CONFERENCE</option>
                <option value="WORKSHOP">🛠️ WORKSHOP</option>
                <option value="SEMINAR">📚 SEMINAR</option>
                <option value="TRAINING">🎓 TRAINING</option>
                <option value="OTHER">📝 OTHER</option>
              </select>
            </div>

            {/* Date Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Start Date</label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => onChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 bg-green-50/50 border border-green-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200/50 focus:border-green-400 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">End Date</label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => onChange('endDate', e.target.value)}
                  className="w-full px-4 py-3 bg-green-50/50 border border-green-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200/50 focus:border-green-400 transition-all"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-200"
              >
                {isEditing ? 'Update Event' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-2xl hover:bg-slate-200 transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};