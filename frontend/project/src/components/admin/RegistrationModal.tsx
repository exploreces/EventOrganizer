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

  // Optional: Log the data for debugging
  console.log("Registrations fetched for modal:", registrations);

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
                  Registrations
                </Dialog.Title>

                {loading ? (
                  <p className="text-gray-600">Loading...</p>
                ) : !isValidArray || registrations.length === 0 ? (
                  <p className="text-gray-500">No registrations found.</p>
                ) : (
                  <ul className="space-y-2">
                    {registrations.map((reg: Registration) => (
                      <li key={reg.id} className="border p-3 rounded-md bg-gray-50">
                        <p>
                          <strong>Email:</strong> {reg.userEmail}
                        </p>
                        <p>
                          <strong>Registered At:</strong>{' '}
                          {new Date(reg.registeredAt).toLocaleString()}
                        </p>
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
