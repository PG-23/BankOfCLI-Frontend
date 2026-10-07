import { useEffect } from 'react';
import { formatCents } from '../utils/money';

interface ConfirmWithdrawModalProps {
  amountCents:  number;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel:  () => void;
}

export function ConfirmWithdrawModal({
  amountCents,
  isProcessing,
  onConfirm,
  onCancel,
}: ConfirmWithdrawModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isProcessing) {
        onCancel();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing, onCancel]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isProcessing) {
          onCancel();
        }
      }}
    >
      <section
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="withdraw-confirm-title"
        aria-describedby="withdraw-confirm-description"
      >
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl text-amber-700">
          $
        </div>

        <h2
          id="withdraw-confirm-title"
          className="text-xl font-bold text-slate-900"
        >
          Confirm withdrawal
        </h2>

        <p
          id="withdraw-confirm-description"
          className="mt-2 text-sm leading-6 text-slate-600"
        >
          You are about to withdraw{' '}
          <span className="font-semibold text-slate-900">
            {formatCents(amountCents)}
          </span>{' '}
          from your account. Confirm to continue.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isProcessing && (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
            )}
            {isProcessing ? 'Processing...' : 'Confirm withdrawal'}
          </button>
        </div>
      </section>
    </div>
  );
}
