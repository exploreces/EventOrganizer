import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import api from '../../utils/api';

interface BudgetTrackerProps {
  eventId: number;
  isOpen?: boolean;
  onClose?: () => void;
}

// Updated interface to match backend field names
interface BudgetItem {
  id: number;
  eventId: number;
  description: string; // Changed from taskName
  cost: number; // Changed from estimatedCost
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({ eventId, isOpen = true, onClose }) => {
  // Main state
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingBudget, setIsSavingBudget] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [taskName, setTaskName] = useState('');
  const [taskBudget, setTaskBudget] = useState(0);

  // Derived values - updated to use cost instead of estimatedCost
  const totalSpent = budgetItems.reduce((sum, item) => sum + (item.cost || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Fetch all budget items and budget status
  const fetchBudgetItems = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/budgets/events/${eventId}`);
      const items = Array.isArray(response.data) ? response.data : [];
      setBudgetItems(items);

      try {
        const statusResponse = await api.get(`/api/budgets/budget/status/${eventId}`);
        if (statusResponse.data?.assignedBudget) { // Changed from totalEstimated to assignedBudget
          setTotalBudget(statusResponse.data.assignedBudget);
        } else {
          // Default to spent amount or 1000 if no budget is set
          const spent = items.reduce((sum, item) => sum + (item.cost || 0), 0); // Changed from estimatedCost to cost
          setTotalBudget(totalBudget === 0 ? Math.max(spent, 1000) : totalBudget);
        }
      } catch (statusErr) {
        console.error("Budget status fetch failed:", statusErr);
        // Keep existing budget or use spent amount as fallback
        if (totalBudget === 0) {
          const spent = items.reduce((sum, item) => sum + (item.cost || 0), 0); // Changed from estimatedCost to cost
          setTotalBudget(Math.max(spent, 1000));
        }
      }

      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch budget items:', err);
      setError('Failed to load budget data. Please try again.');
      setBudgetItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save the total event budget
  const updateEventBudget = async () => {
    try {
      setIsSavingBudget(true);
      await api.put(`/api/budgets/events/${eventId}/budget`, { budget: totalBudget });
      await fetchBudgetItems(); // Refresh data
      setError(null);
    } catch (err: any) {
      console.error('Failed to update event budget:', err);
      setError('Failed to save total budget. Please try again.');
    } finally {
      setIsSavingBudget(false);
    }
  };

  // Add or update a budget item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim() || taskBudget <= 0) {
      setError('Please enter a task name and a budget greater than 0.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Updated payload to match backend field names
      const payload = {
        description: taskName.trim(),
        cost: taskBudget,
        eventId
      };

      if (editingItemId) {
        await api.put(`/api/budgets/${editingItemId}`, payload);
      } else {
        await api.post('/api/budgets', payload);
      }

      resetForm();
      await fetchBudgetItems();
    } catch (err: any) {
      console.error('Failed to save budget item:', err);
      setError('Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a budget item
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this budget item?')) {
      try {
        setIsLoading(true);
        await api.delete(`/api/budgets/${id}`);
        await fetchBudgetItems();
      } catch (err: any) {
        console.error('Failed to delete budget item:', err);
        setError('Failed to delete task. Please try again.');
        setIsLoading(false);
      }
    }
  };

  // Set up form for editing - updated to use description instead of taskName
  const handleEdit = (item: BudgetItem) => {
    setEditingItemId(item.id);
    setTaskName(item.description || '');
    setTaskBudget(item.cost || 0);
  };

  // Reset form fields
  const resetForm = () => {
    setTaskName('');
    setTaskBudget(0);
    setEditingItemId(null);
  };

  // Load data on component mount
  useEffect(() => {
    if (eventId && isOpen) {
      fetchBudgetItems();
    }
  }, [eventId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Budget Tracker</h2>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="p-5 space-y-5">
          {/* Error display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Budget Overview */}
          <Card>
            <CardHeader className="py-3">
              <h3 className="text-base font-semibold">Budget Overview</h3>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total Budget Input */}
                <div>
                  <label htmlFor="totalBudget" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Budget ($)
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="totalBudget"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(Math.max(0, Number(e.target.value) || 0))}
                      className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3"
                      min="0"
                    />
                    <button
                      onClick={updateEventBudget}
                      disabled={isSavingBudget}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md flex items-center justify-center disabled:opacity-50"
                    >
                      {isSavingBudget ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : "Save"}
                    </button>
                  </div>
                </div>

                {/* Budget Usage */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Budget Usage</div>
                  <div className="text-lg font-bold">${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${percentUsed > 90 ? 'bg-red-600' : percentUsed > 75 ? 'bg-yellow-500' : 'bg-green-600'}`}
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-sm flex justify-between">
                    <span className={remainingBudget < 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                      {remainingBudget < 0 ? 'Over budget by' : 'Remaining'}: ${Math.abs(remainingBudget).toLocaleString()}
                    </span>
                    <span className="text-gray-500">{percentUsed}% used</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add/Edit Task Form */}
          <Card>
            <CardHeader className="py-3">
              <h3 className="text-base font-semibold">{editingItemId ? 'Edit Task' : 'Add New Task'}</h3>
            </CardHeader>
            <CardContent className="pb-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">
                      Task Name
                    </label>
                    <input
                      type="text"
                      id="taskName"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      placeholder="Enter task name"
                    />
                  </div>
                  <div>
                    <label htmlFor="taskBudget" className="block text-sm font-medium text-gray-700">
                      Budget ($)
                    </label>
                    <input
                      type="number"
                      id="taskBudget"
                      value={taskBudget}
                      onChange={(e) => setTaskBudget(Number(e.target.value) || 0)}
                      required
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  {editingItemId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 py-1.5 border border-transparent text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    {isSubmitting && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {editingItemId ? 'Update Task' : 'Add Task'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Budget Items List */}
          <Card>
            <CardHeader className="py-3">
              <h3 className="text-base font-semibold">Budget Items</h3>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-6">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-3 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-500 text-sm">Loading budget items...</p>
                </div>
              ) : budgetItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Task
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Budget
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {budgetItems.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.description}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                            ${(item.cost || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-900 mr-2"
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900"
                              type="button"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                          Total
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                          ${totalSpent.toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">No budget items added yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};