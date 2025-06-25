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
          <div className="fixed inset-0 bg-black bg-opacity-30" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                  Feedbacks
                </Dialog.Title>

                {loading ? (
                  <p>Loading...</p>
                ) : feedbacks.length === 0 ? (
                  <p className="text-gray-500">No feedbacks available for this event.</p>
                ) : (
                  <ul className="space-y-3">
                    {feedbacks.map((fb) => (
                      <li
                        key={fb.id}
                        className="border p-4 rounded-lg bg-gray-50 flex justify-between items-center"
                      >
                        <div>
                          <p><strong>Email:</strong> {fb.userEmail}</p>
                          <p><strong>Stars:</strong> {fb.stars}/10</p>
                          {fb.message && <p><strong>Message:</strong> {fb.message}</p>}
                        </div>
                        <button
                          onClick={() => handleDelete(fb.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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
