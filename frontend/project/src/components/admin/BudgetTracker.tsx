import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Event } from '@/types';

interface BudgetTrackerProps {
  events: Event[];
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({ events }) => {
  const totalRevenue = events.reduce((sum, e) => sum + e.price * e.currentAttendees, 0);
  const projectedRevenue = events.reduce((sum, e) => sum + e.price * e.maxAttendees, 0);
  const averagePrice = events.length ? Math.round(events.reduce((sum, e) => sum + e.price, 0) / events.length) : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Tracker</h1>
        <p className="text-gray-600">Monitor expenses and budget allocation across events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Budget Overview</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {events.slice(0, 3).map((event) => {
                  const projected = event.price * event.maxAttendees * 0.8;
                  const actual = event.price * event.currentAttendees;
                  const percent = (event.currentAttendees / event.maxAttendees) * 100;

                  return (
                    <div key={event.id} className="border-l-4 border-blue-600 pl-4">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Budgeted</span>
                          <span className="font-medium">${projected.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Actual Revenue</span>
                          <span className="font-medium text-green-600">${actual.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">{Math.round(percent)}% of target reached</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Total Financial Overview</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-700">${totalRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Projected Revenue</p>
                <p className="text-2xl font-bold text-blue-700">${projectedRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Average Ticket Price</p>
                <p className="text-2xl font-bold text-purple-700">${averagePrice}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
