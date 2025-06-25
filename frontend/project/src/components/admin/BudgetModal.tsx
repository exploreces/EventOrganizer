// src/components/admin/BudgetModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Check, Save } from 'lucide-react';
import {
  getBudgetsForEvent,
  createBudget,
  updateBudget,
  deleteBudget,
  getPlannersForEvent,
  createPlanner,
} from '../../utils/api';


interface BudgetItem {
  id?: number;
  description: string;
  cost: number;
  done: boolean;
}

interface Event {
  id: string;
  title: string;
}

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

import { parseJwt } from '../../utils/jwtUtils'; // Make sure this function exists

const getUserEmail = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decoded = parseJwt(token);
  return decoded?.sub || decoded?.email || null;
};

const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, event }) => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({ description: '', cost: 0 });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchBudgetData();
    }
  }, [isOpen, event.id]);

  const fetchBudgetData = async () => {
    try {
      const [budgetsRes, plannersRes] = await Promise.all([
        getBudgetsForEvent(Number(event.id)),
        getPlannersForEvent(Number(event.id)),
      ]);
      setBudgetItems(budgetsRes.data || []);
      setNotes(plannersRes.data?.[0]?.note || '');
    } catch (err) {
      console.error('Error loading budget/planner data', err);
    }
  };

  const saveBudgetItem = async (item: BudgetItem) => {
    try {
      if (item.id) {
        await updateBudget(item.id, {
          eventId: Number(event.id),
          description: item.description,
          cost: item.cost,
          done: item.done,
        });
      } else {
        await createBudget({
          eventId: Number(event.id),
          description: item.description,
          cost: item.cost,
          done: item.done,
        });
      }
      fetchBudgetData();
    } catch (err) {
      console.error('Error saving budget item:', err);
    }
  };

  const addNewItem = async () => {
    if (!newItem.description.trim()) return;
    await saveBudgetItem({ ...newItem, done: false });
    setNewItem({ description: '', cost: 0 });
    setShowAddForm(false);
  };

  const toggleDone = async (item: BudgetItem) => {
    const updated = { ...item, done: !item.done };
    await saveBudgetItem(updated);
  };

const saveNotes = async () => {
  const email = getUserEmail();
  try {
    await createPlanner({
      title: event.title,
      note: notes,
      eventId: Number(event.id),
      createdBy: email,
    });
  } catch (err) {
    console.error('Error saving planner note:', err);
  }
};


  const handleDelete = async (id: number) => {
    await deleteBudget(id);
    setBudgetItems(items => items.filter(item => item.id !== id));
  };

  const totalCost = budgetItems.reduce((sum, i) => sum + i.cost, 0);
  const completedCost = budgetItems.filter(i => i.done).reduce((sum, i) => sum + i.cost, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Budget & Planner</h2>
            <p className="text-sm text-gray-600">{event.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Summary */}
          <div className="mb-6 flex justify-between bg-blue-50 p-4 rounded-md shadow-sm">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-xl font-bold text-blue-700">${totalCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-lg font-semibold text-green-600">${completedCost.toFixed(2)}</p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Budget Items</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            {showAddForm && (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Cost"
                  value={newItem.cost || ''}
                  onChange={(e) =>
                    setNewItem({ ...newItem, cost: parseFloat(e.target.value) || 0 })
                  }
                  className="w-24 px-3 py-2 border rounded-md"
                />
                <button onClick={addNewItem} className="bg-green-500 text-white px-3 py-2 rounded-md">
                  Add
                </button>
              </div>
            )}

            <div className="space-y-2">
              {budgetItems.map(item => (
                <div
                  key={item.id}
                  className={`p-3 border rounded-md flex justify-between items-center ${
                    item.done ? 'bg-green-50 border-green-200' : 'bg-white'
                  }`}
                >
                  <div className="flex-1">
                    {editingId === item.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            setBudgetItems(items =>
                              items.map(i =>
                                i.id === item.id ? { ...i, description: e.target.value } : i
                              )
                            )
                          }
                          className="flex-1 px-2 py-1 border rounded"
                        />
                        <input
                          type="number"
                          value={item.cost}
                          onChange={(e) =>
                            setBudgetItems(items =>
                              items.map(i =>
                                i.id === item.id ? { ...i, cost: parseFloat(e.target.value) || 0 } : i
                              )
                            )
                          }
                          className="w-24 px-2 py-1 border rounded"
                        />
                      </div>
                    ) : (
                      <div>
                        <span className={item.done ? 'line-through text-gray-500' : 'text-gray-800'}>
                          {item.description}
                        </span>{' '}
                        - <span className="font-medium text-gray-700">${item.cost}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleDone(item)} className="text-green-600">
                      <Check size={18} />
                    </button>
                    {editingId === item.id ? (
                      <button
                        onClick={() => {
                          saveBudgetItem(item);
                          setEditingId(null);
                        }}
                        className="text-green-700"
                      >
                        <Save size={18} />
                      </button>
                    ) : (
                      <button onClick={() => setEditingId(item.id!)} className="text-blue-600">
                        <Edit2 size={18} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(item.id!)} className="text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-24 border rounded-md p-2 focus:ring"
              placeholder="Write your planning notes here..."
            />
            <button
              onClick={saveNotes}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Save size={16} />
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;
