import { useEffect } from 'react';

type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type:    ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timeoutId);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg sm:right-6 sm:top-6 ${
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
          : 'border-red-200 bg-red-50 text-red-900'
      }`}
      role={isSuccess ? 'status' : 'alert'}
      aria-live={isSuccess ? 'polite' : 'assertive'}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          isSuccess
            ? 'bg-emerald-600 text-white'
            : 'bg-red-600 text-white'
        }`}
        aria-hidden="true"
      >
        {isSuccess ? '✓' : '!'}
      </span>

      <p className="flex-1 text-sm font-medium leading-6">{message}</p>

      <button
        type="button"
        onClick={onClose}
        className="rounded-md px-1 text-lg leading-6 opacity-60 transition hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
