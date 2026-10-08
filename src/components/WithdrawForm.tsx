import { type FormEvent, useEffect, useState } from 'react';
import type { Account, Transaction } from '../models';
import { Button, Input, Modal } from './ui';
import { useAuth } from '../hooks/useAuth';
import { getWithdrawAccount, withdraw } from '../services/withdrawService';
import { getApiError } from '../utils/apiError';
import { formatCents, parseDollarsToCents } from '../utils/money';
import { notify } from '../utils/notify';

interface WithdrawFormProps {
  onWithdrawalComplete?: (
    transaction: Transaction,
    newBalanceCents: number,
  ) => void;
}

function WithdrawIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 20V9m0 0-4.5 4.5M12 9l4.5 4.5M5 4h14" />
    </svg>
  );
}

function CheckCircleIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

function validateAmount(input: string, balanceCents: number): string | undefined {
  const trimmed = input.trim();

  if (trimmed === '') return 'Enter a withdrawal amount.';
  if (trimmed.startsWith('-')) return "Amount can't be negative.";

  const cents = parseDollarsToCents(trimmed);
  if (cents === null) {
    const looksLikeMoney = /^\$?[\d,]+(\.\d{1,2})?$/.test(trimmed);
    return looksLikeMoney
      ? `Enter an amount between $0.01 and ${formatCents(balanceCents)}.`
      : 'Enter a valid dollar amount, like 125.50.';
  }

  if (cents > balanceCents) {
    return `Amount can't exceed your available balance of ${formatCents(balanceCents)}.`;
  }

  return undefined;
}

export function WithdrawForm({ onWithdrawalComplete }: WithdrawFormProps) {
  const { account: authAccount } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [serviceFieldError, setServiceFieldError] = useState<string | undefined>();
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAmountCents, setPendingAmountCents] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      if (!authAccount) {
        if (active) {
          setAccount(null);
          setIsLoadingAccount(false);
        }
        return;
      }

      setIsLoadingAccount(true);
      try {
        const latestAccount = await getWithdrawAccount(authAccount.accountNumber);
        if (active) setAccount(latestAccount);
      } catch (error) {
        if (active) {
          setAccount(null);
          notify.error(getApiError(error)?.message ?? 'Unable to load account information.');
        }
      } finally {
        if (active) setIsLoadingAccount(false);
      }
    }

    void loadAccount();
    return () => {
      active = false;
    };
  }, [authAccount]);

  if (isLoadingAccount) {
    return (
      <section id="withdraw" className="w-full">
        <div
          aria-busy="true"
          aria-label="Loading account"
          className="h-80 animate-pulse rounded-md border border-border bg-surface"
        />
      </section>
    );
  }

  if (!account) {
    return (
      <section id="withdraw" className="w-full">
        <p role="alert" className="rounded-sm bg-error-bg p-4 text-error">
          We could not load the account needed for withdrawals.
        </p>
      </section>
    );
  }

  const clientError = validateAmount(amount, account.balanceCents);
  const visibleError = serviceFieldError ?? (showErrors ? clientError : undefined);
  const cents = clientError ? null : parseDollarsToCents(amount);
  const balanceAfterWithdrawal = account.balanceCents - (cents ?? 0);
  const rangeMessage = `Enter an amount between $0.01 and ${formatCents(account.balanceCents)}.`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isProcessing) return;

    if (cents === null) {
      setShowErrors(true);
      return;
    }

    setServiceFieldError(undefined);
    setPendingAmountCents(cents);
    setIsConfirmOpen(true);
  }

  function closeConfirmation() {
    if (isProcessing) return;
    setIsConfirmOpen(false);
    setPendingAmountCents(null);
  }

  async function handleConfirmWithdrawal() {
    if (!account || pendingAmountCents === null || isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await withdraw({
        accountNumber: account.accountNumber,
        amountCents: pendingAmountCents,
      });

      setAccount(current =>
        current ? { ...current, balanceCents: response.newBalanceCents } : current,
      );
      setAmount('');
      setShowErrors(false);
      setServiceFieldError(undefined);
      setIsConfirmOpen(false);
      setPendingAmountCents(null);

      notify.success(
        `Withdrew ${formatCents(pendingAmountCents)}. New balance: ${formatCents(response.newBalanceCents)}.`,
      );
      onWithdrawalComplete?.(response.transaction, response.newBalanceCents);
    } catch (error) {
      const apiError = getApiError(error);
      if (apiError?.field === 'amountCents') {
        setServiceFieldError(apiError.message);
        setShowErrors(true);
      } else {
        notify.error(apiError?.message ?? 'The withdrawal could not be completed. Please try again.');
      }
      setIsConfirmOpen(false);
      setPendingAmountCents(null);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <section id="withdraw" className="w-full">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 rounded-md border border-border bg-surface p-6"
      >
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-success-bg text-primary">
            <WithdrawIcon className="size-5" />
          </span>
          <div>
            <h2 className="text-title font-semibold text-text-main">Withdraw funds</h2>
            <p className="text-small text-text-muted">Take money from your available balance.</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Input
            id="withdraw-amount"
            label="Withdrawal amount *"
            name="withdrawAmount"
            inputMode="decimal"
            autoComplete="off"
            placeholder="$0.00"
            value={amount}
            onChange={event => {
              setAmount(event.target.value);
              setServiceFieldError(undefined);
            }}
            onBlur={() => amount.trim() !== '' && setShowErrors(true)}
            disabled={isProcessing}
            error={visibleError}
          />
          {!visibleError && <p className="text-small text-text-muted">{rangeMessage}</p>}
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-small text-text-muted">Balance after withdrawal</span>
          <span className="font-semibold tabular-nums text-text-main">
            {formatCents(balanceAfterWithdrawal)}
          </span>
        </div>

        {cents !== null && (
          <div role="status" className="flex gap-2 rounded-sm border-l-4 border-primary bg-success-bg p-4">
            <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium text-text-main">Ready to withdraw</p>
              <p className="text-small text-text-muted">
                Review and confirm the withdrawal before the balance is updated.
              </p>
            </div>
          </div>
        )}

        <Button type="submit" fullWidth disabled={account.balanceCents <= 0 || isProcessing}>
          {cents !== null ? `Withdraw ${formatCents(cents)}` : 'Withdraw'}
          <WithdrawIcon className="size-4" />
        </Button>
      </form>

      <Modal
        open={isConfirmOpen && pendingAmountCents !== null}
        onClose={closeConfirmation}
        title="Confirm withdrawal"
      >
        {pendingAmountCents !== null && (
          <>
            <p className="text-base text-text-muted">
              Review the amount below before completing the withdrawal.
            </p>

            <div className="mt-4 rounded-md border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-base text-text-muted">Withdrawal amount</span>
                <span className="text-title font-semibold text-text-main">
                  {formatCents(pendingAmountCents)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 border-t border-border pt-3">
                <span className="text-base text-text-muted">Balance after withdrawal</span>
                <span className="text-base font-semibold text-text-main">
                  {formatCents(account.balanceCents - pendingAmountCents)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={closeConfirmation}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => void handleConfirmWithdrawal()}
                loading={isProcessing}
              >
                {isProcessing ? 'Processing withdrawal…' : 'Confirm withdrawal'}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
