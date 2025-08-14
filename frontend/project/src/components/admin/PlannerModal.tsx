// src/components/admin/PlannerModal.tsx
import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Trash2, Edit, Save } from 'lucide-react';
import api from '../../utils/api';
import { getUserByEmail } from '../../utils/api';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { parseJwt } from '../../utils/jwtUtils';

interface PlannerModalProps {
  eventId?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

// Updated with proper ID field
interface PlannerNote {
  id: number;
  title: string;
  note: string;
  eventId: number;
  createdBy: string;
}

interface User {
  email: string;
  name?: string;
  role?: string;
}

const PlannerModal: React.FC<PlannerModalProps> = ({ eventId, isOpen = true, onClose }) => {
  const [notes, setNotes] = useState<PlannerNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState<PlannerNote | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [eventDetails, setEventDetails] = useState<{id: number, name: string} | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  // Get user email from JWT token
  useEffect(() => {
    if (!isOpen) return;

    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = parseJwt(token);
        const email = decoded?.email || decoded?.sub;

        if (email) {
          setUserEmail(email);

          // Fetch user profile using the API utility
          getUserByEmail(email)
            .then(res => {
              if (res && res.data) {
                setUserProfile(res.data);
              }
            })
            .catch(err => {
              console.error("Error fetching user profile:", err);
            });
        }
      }
    } catch (e) {
      console.error('Error parsing token:', e);
    }
  }, [isOpen]);

  // Fetch event details
  useEffect(() => {
    if (!isOpen || !eventId) return;

    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/api/events/${eventId}`);
        setEventDetails(response.data);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details.');
      }
    };

    fetchEventDetails();
  }, [isOpen, eventId]);

  // Fetch notes for the event
  const fetchNotes = async () => {
    if (!isOpen || !eventId) return;

    setLoading(true);
    try {
      const response = await api.get(`/api/planners/event/${eventId}`);
      setNotes(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes. Please try again.');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && eventId) {
      fetchNotes();
    }
  }, [isOpen, eventId]);

  const handleAddNote = async () => {
    if (!title.trim() || !noteContent.trim() || !eventId) {
      setError('Please enter title and note content');
      return;
    }

    const creatorEmail = userProfile?.email || userEmail;

    if (!creatorEmail) {
      setError('User email not available. Please try again.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        title: title.trim(),
        note: noteContent.trim(),
        eventId,
        createdBy: creatorEmail
      };

      if (editingNote) {
        await api.put(`/api/planners/${editingNote.id}`, payload);
      } else {
        await api.post('/api/planners', payload);
      }

      await fetchNotes();
      resetForm();
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (note: PlannerNote) => {
    setEditingNote(note);
    setTitle(note.title);
    setNoteContent(note.note);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      setLoading(true);
      await api.delete(`/api/planners/${id}`);
      await fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setNoteContent('');
    setEditingNote(null);
  };

  // Check if a note was created by the current user
  const isCreatedByCurrentUser = (noteCreator: string) => {
    if (userProfile?.email === noteCreator) return true;
    if (userEmail === noteCreator) return true;
    return false;
  };

  if (!isOpen || !eventId || !eventDetails) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-bold text-gray-900">
            <span className="text-indigo-600 mr-2">📝</span>
            Collaboration Notes: {eventDetails.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Notes list */}
          <div className="md:w-1/2 p-5 overflow-y-auto border-r border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Team Notes</h3>

              {/* Display user info */}
              <div className="flex items-center text-xs bg-blue-50 p-2 rounded-lg">
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-2">
                  {userProfile?.name?.[0]?.toUpperCase() || userEmail?.[0]?.toUpperCase() || '?'}
                </div>
                <span>{userProfile?.email || userEmail || 'Loading user...'}</span>
              </div>
            </div>

            {loading && <p className="text-gray-500">Loading notes...</p>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm mb-4">{error}</div>}

            {!loading && notes.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <MessageSquare className="mx-auto mb-2 opacity-20" size={40} />
                <p>No notes yet. Be the first to add one!</p>
              </div>
            )}

            <div className="space-y-4">
              {notes.map((note) => (
                <Card key={note.id} className="border border-gray-200 hover:border-indigo-200 transition-all">
                  <CardHeader className="p-3 pb-2 flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-medium">{note.title}</h4>
                      <p className="text-xs text-gray-500">By: {note.createdBy}</p>
                    </div>

                    {/* Edit/Delete buttons - shown only for notes created by current user */}
                    {isCreatedByCurrentUser(note.createdBy) && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(note)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Add/Edit note form */}
          <div className="md:w-1/2 p-5 bg-gray-50">
            <h3 className="text-lg font-medium mb-4 text-gray-800">
              {editingNote ? 'Edit Note' : 'Add New Note'}
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Note title"
                />
              </div>

              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea
                  id="note"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Write your thoughts or ideas here..."
                ></textarea>
              </div>

              <div className="flex justify-between">
                {editingNote && (
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleAddNote}
                  disabled={submitting || !title.trim() || !noteContent.trim()}
                  className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed ml-auto flex items-center"
                >
                  {submitting ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : editingNote ? <Save size={16} className="mr-2" /> : null}
                  {editingNote ? 'Update Note' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerModal;