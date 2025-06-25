import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { getFeedbacksByEvent, deleteFeedback } from '../../utils/api';

interface Feedback {
  id: number;
  eventId: number;
  stars: number;
  message?: string;
  userEmail: string;
}

interface Props {
  eventId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<Props> = ({ eventId, isOpen, onClose }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const res = await getFeedbacksByEvent(eventId);
        setFeedbacks(res.data || []);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [eventId]);

  const handleDelete = async (feedbackId: number) => {
    try {
      await deleteFeedback(feedbackId);
      setFeedbacks(prev => prev.filter(f => f.id !== feedbackId));
    } catch (err) {
      console.error('Failed to delete feedback', err);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < rating
                ? 'bg-gradient-to-r from-rose-300 to-pink-300'
                : 'bg-slate-200'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-slate-600">{rating}/10</span>
      </div>
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          leave="ease-in duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              leave="ease-in duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-white to-blue-50/30 p-8 shadow-2xl border border-purple-100/50 backdrop-blur-sm transition-all">
                <div className="mb-6">
                  <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    ✨ Event Feedbacks
                  </Dialog.Title>
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full"></div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-400 animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 flex items-center justify-center">
                      <span className="text-3xl">💭</span>
                    </div>
                    <p className="text-slate-500 text-lg font-medium">No feedbacks available for this event yet.</p>
                    <p className="text-slate-400 text-sm mt-2">Check back later for participant responses!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {feedbacks.map((fb, index) => (
                      <div
                        key={fb.id}
                        className={`relative overflow-hidden rounded-2xl p-6 shadow-lg border transition-all hover:shadow-xl hover:scale-[1.02] ${
                          index % 3 === 0
                            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50'
                            : index % 3 === 1
                            ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/50'
                            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                index % 3 === 0
                                  ? 'bg-gradient-to-r from-blue-400 to-indigo-400'
                                  : index % 3 === 1
                                  ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                                  : 'bg-gradient-to-r from-green-400 to-emerald-400'
                              }`}>
                                {fb.userEmail.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-slate-700">{fb.userEmail}</p>
                                <p className="text-xs text-slate-500">Participant</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium text-slate-600 mb-1">Rating</p>
                                {renderStars(fb.stars)}
                              </div>

                              {fb.message && (
                                <div>
                                  <p className="text-sm font-medium text-slate-600 mb-1">Message</p>
                                  <p className="text-slate-700 bg-white/60 p-3 rounded-xl border border-white/50 leading-relaxed">
                                    "{fb.message}"
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDelete(fb.id)}
                            className="ml-4 p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 transition-all hover:scale-110 group"
                            title="Delete feedback"
                          >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-200"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};