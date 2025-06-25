import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Registration, useRegistrations } from '../../hooks/useRegistrations';

interface Props {
  eventId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationModal: React.FC<Props> = ({ eventId, isOpen, onClose }) => {
  const { registrations, loading } = useRegistrations(eventId ?? undefined);

  const isValidArray = Array.isArray(registrations);

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
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 shadow-2xl transition-all p-6">
                <Dialog.Title className="text-2xl font-bold text-purple-700 mb-6 text-center">
                  ✨ Event Registrations
                </Dialog.Title>

                {loading ? (
                  <p className="text-center text-gray-600">Loading...</p>
                ) : !isValidArray || registrations.length === 0 ? (
                  <p className="text-center text-gray-500">No registrations found.</p>
                ) : (
                  <ul className="space-y-4">
                    {registrations.map((reg: Registration) => (
                      <li
                        key={reg.id}
                        className="bg-white rounded-xl p-4 shadow-sm border border-pink-200 hover:shadow-md transition"
                      >
                        <p className="text-gray-800">
                          <span className="font-medium text-pink-600">📧 Email:</span>{' '}
                          {reg.userEmail}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium text-purple-600">🕒 Registered At:</span>{' '}
                          {new Date(reg.registeredAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={onClose}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full shadow transition duration-200"
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
