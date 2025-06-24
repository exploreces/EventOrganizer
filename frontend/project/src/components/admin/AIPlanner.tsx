import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Brain } from 'lucide-react';

export const AIPlanner: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Event Planner</h1>
        <p className="text-gray-600">Get intelligent suggestions for your event planning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-purple-600" />
              Planning Assistant
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Smart Venue Suggestions</h3>
              <p className="text-gray-600 text-sm">
                Based on your event type and expected attendance, here are optimal venues:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-700">
                <li>• Convention Center (500+ capacity)</li>
                <li>• Hotel Conference Room (100–300 capacity)</li>
                <li>• Outdoor Pavilion (200–400 capacity)</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Budget Optimization</h3>
              <p className="text-gray-600 text-sm">
                Recommended budget allocation for a 300-person tech conference:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-700">
                <li>• Venue: 40% ($12,000)</li>
                <li>• Catering: 30% ($9,000)</li>
                <li>• A/V Equipment: 15% ($4,500)</li>
                <li>• Marketing: 15% ($4,500)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Event Timeline Generator</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: '8 Weeks Before', text: 'Book venue, send save-the-dates' },
                { label: '6 Weeks Before', text: 'Confirm speakers, open registration' },
                { label: '4 Weeks Before', text: 'Finalize catering, A/V setup' },
                { label: '2 Weeks Before', text: 'Send final details to attendees' },
                { label: 'Event Day', text: 'Execute your perfect event!' },
              ].map(({ label, text }, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full mt-1 ${
                      label === 'Event Day' ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-gray-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
