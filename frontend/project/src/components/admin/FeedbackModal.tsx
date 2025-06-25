import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
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
    const fiveStarRating = Math.round(rating / 2);
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < fiveStarRating ? 'text-yellow-400' : 'text-slate-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm font-medium text-slate-600">{fiveStarRating}/5</span>
      </div>
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" leave="ease-in duration-200" enterFrom="opacity-0" enterTo="opacity-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white/40 backdrop-blur-2xl p-8 shadow-xl border border-white/30 transition-all">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-1 text-center bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text">
                    💬 Event Feedback
                  </h2>
                  <p className="text-center text-slate-600">Read what participants said about the event</p>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin w-10 h-10 border-4 border-slate-200 border-t-purple-400 rounded-full" />
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div className="text-center py-10 bg-white/50 rounded-2xl border-2 border-dashed border-purple-200">
                    <p className="text-xl text-gray-500 font-medium">No feedbacks yet 💭</p>
                    <p className="text-gray-400 mt-2">Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 max-h-[60vh] overflow-y-auto pr-2">
                    {feedbacks.map(fb => (
                      <div
                        key={fb.id}
                        className="bg-white/70 backdrop-blur-md border border-purple-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition transform hover:scale-105 group"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 text-white rounded-full flex items-center justify-center font-semibold shadow-md">
                              {fb.userEmail.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-800">{fb.userEmail}</span>
                          </div>
                          <button
                            onClick={() => handleDelete(fb.id)}
                            className="opacity-0 group-hover:opacity-100 transition-all hover:scale-110 p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="mb-2">{renderStars(fb.stars)}</div>

                        <div
                          className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-gray-700 italic text-sm leading-relaxed shadow-inner max-w-[90%] mx-auto"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {fb.message || 'No message provided.'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 text-right">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-medium rounded-xl hover:from-slate-200 hover:to-slate-300 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
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
