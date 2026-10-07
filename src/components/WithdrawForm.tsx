import { type FormEvent, useCallback, useEffect, useState } from 'react';
import type { Account, Transaction } from '../models';
import {
  ApiServiceError,
  getWithdrawAccount,
  withdraw,
} from '../services/withdrawService';
import { formatCents, parseDollarsToCents } from '../utils/money';
import { ConfirmWithdrawModal } from './ConfirmWithdrawModal';
import { Toast } from './Toast';

interface WithdrawFormProps {
  onWithdrawalComplete?: (
    transaction: Transaction,
    newBalanceCents: number,
  ) => void;
}

type ToastState = {
  message: string;
  type: 'success' | 'error';
};

export function WithdrawForm({ onWithdrawalComplete }: WithdrawFormProps) {
  const [account, setAccount]                       = useState<Account | null>(null);
  const [amount, setAmount]                         = useState('');
  const [fieldError, setFieldError]                 = useState<string | null>(null);
  const [isLoadingAccount, setIsLoadingAccount]     = useState(true);
  const [isConfirmOpen, setIsConfirmOpen]           = useState(false);
  const [isProcessing, setIsProcessing]             = useState(false);
  const [pendingAmountCents, setPendingAmountCents] = useState<number | null>(
    null,
  );
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAccount() {
      try {
        const loadedAccount = await getWithdrawAccount();
        if (isMounted) {
          setAccount(loadedAccount);
        }
      } catch {
        if (isMounted) {
          setToast({
            type: 'error',
            message: 'Unable to load account information. Please try again.',
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingAccount(false);
        }
      }
    }

    void loadAccount();

    return () => {
      isMounted = false;
    };
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  function validateAmount(): number | null {
    const amountCents = parseDollarsToCents(amount);

    if (amountCents === null) {
      setFieldError('Enter a valid amount greater than $0.00.');
      return null;
    }

    if (account && amountCents > account.balanceCents) {
      setFieldError('This amount is greater than your available balance.');
      return null;
    }

    setFieldError(null);
    return amountCents;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!account || isProcessing) {
      return;
    }

    const amountCents = validateAmount();
    if (amountCents === null) {
      return;
    }

    setPendingAmountCents(amountCents);
    setIsConfirmOpen(true);
  }

  function handleAmountChange(value: string) {
    setAmount(value);
    if (fieldError) {
      setFieldError(null);
    }
  }

  function handleCancelConfirmation() {
    if (isProcessing) {
      return;
    }

    setIsConfirmOpen(false);
    setPendingAmountCents(null);
  }

  async function handleConfirmWithdrawal() {
    if (!account || pendingAmountCents === null || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await withdraw({
        accountNumber: account.accountNumber,
        amountCents:   pendingAmountCents,
      });

      setAccount((current) =>
        current
          ? { ...current, balanceCents: response.newBalanceCents }
          : current,
      );
      setAmount('');
      setFieldError(null);
      setIsConfirmOpen(false);
      setPendingAmountCents(null);
      setToast({
        type: 'success',
        message: `Withdrawal successful. New balance: ${formatCents(response.newBalanceCents)}.`,
      });

      onWithdrawalComplete?.(
        response.transaction,
        response.newBalanceCents,
      );
    } catch (error) {
      const message =
        error instanceof ApiServiceError
          ? error.message
          : 'The withdrawal could not be completed. Please try again.';

      setIsConfirmOpen(false);
      setPendingAmountCents(null);
      setToast({ type: 'error', message });
    } finally {
      setIsProcessing(false);
    }
  }

  if (isLoadingAccount) {
    return (
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="animate-pulse" aria-label="Loading account">
          <div className="h-7 w-48 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-100" />
          <div className="mt-8 h-24 rounded-xl bg-slate-100" />
          <div className="mt-6 h-12 rounded-lg bg-slate-100" />
          <div className="mt-4 h-12 rounded-lg bg-slate-200" />
        </div>
      </section>
    );
  }

  if (!account) {
    return (
      <section className="w-full max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900 shadow-sm">
        <h2 className="text-lg font-bold">Account unavailable</h2>
        <p className="mt-2 text-sm">
          We could not load the account needed for withdrawals.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Transaction Center
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Withdraw funds
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose an amount to withdraw from your Bank of CLI account.
          </p>
        </header>

        <div className="mt-7 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            Available balance
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-950">
            {formatCents(account.balanceCents)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Account ending in {account.accountNumber.slice(-4)}
          </p>
        </div>

        <form className="mt-7" onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="withdraw-amount"
            className="block text-sm font-semibold text-slate-800"
          >
            Withdrawal amount
          </label>

          <div
            className={`mt-2 flex items-center rounded-xl border bg-white transition focus-within:ring-2 ${
              fieldError
                ? 'border-red-400 focus-within:border-red-500 focus-within:ring-red-100'
                : 'border-slate-300 focus-within:border-blue-500 focus-within:ring-blue-100'
            }`}
          >
            <span className="pl-4 text-lg font-semibold text-slate-500">$</span>
            <input
              id="withdraw-amount"
              name="withdrawAmount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={amount}
              onChange={(event) => handleAmountChange(event.target.value)}
              disabled={isProcessing}
              aria-invalid={Boolean(fieldError)}
              aria-describedby={fieldError ? 'withdraw-amount-error' : undefined}
              className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-3.5 text-lg font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {fieldError && (
            <p
              id="withdraw-amount-error"
              className="mt-2 text-sm font-medium text-red-600"
              role="alert"
            >
              {fieldError}
            </p>
          )}

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Enter a positive dollar amount with no more than two decimal places.
          </p>

          <button
            type="submit"
            disabled={isProcessing || account.balanceCents <= 0}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Review withdrawal
          </button>
        </form>
      </section>

      {isConfirmOpen && pendingAmountCents !== null && (
        <ConfirmWithdrawModal
          amountCents={pendingAmountCents}
          isProcessing={isProcessing}
          onConfirm={() => void handleConfirmWithdrawal()}
          onCancel={handleCancelConfirmation}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </>
  );
}
