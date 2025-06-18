import * as React from 'react';
import { Dialog as HeadlessDialog } from '@headlessui/react';
import { X } from 'lucide-react';

export const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  return (
    <HeadlessDialog open={open} onClose={() => onOpenChange(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <HeadlessDialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          {children}
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  );
};

export const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-4">{children}</div>;
};

export const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-4">{children}</div>;
};

export const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h3 className="text-xl font-semibold">{children}</h3>;
};

export const DialogFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-4 flex justify-end space-x-2">{children}</div>;
};
