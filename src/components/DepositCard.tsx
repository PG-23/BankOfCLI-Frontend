import { useState, type FormEvent } from 'react';
import type { ApiError, TransactionResponse } from '../models';
import { Button, Input } from './ui';
import { DEPOSIT_MAX_CENTS, DEPOSIT_MIN_CENTS, deposit } from '../services/depositService';
import { formatCents, parseDollarsToCents } from '../utils/money';
import { notify } from '../utils/notify';

type DepositCardProps = {
  accountNumber: string;
  balanceCents: number;
  onDeposited: (res: TransactionResponse) => void; // parent updates its balance / transaction list
};

const RANGE_MESSAGE = `Enter an amount between ${formatCents(DEPOSIT_MIN_CENTS)} and ${formatCents(DEPOSIT_MAX_CENTS)}.`;

// Returns an error message, or undefined if the amount is valid.
function validateAmount(input: string): string | undefined {
  const trimmed = input.trim();
  if (trimmed === '') return 'Enter a deposit amount.';
  if (trimmed.startsWith('-')) return "Amount can't be negative.";

  const cents = parseDollarsToCents(trimmed);
  if (cents === null) {
    const looksLikeMoney = /^\$?[\d,]+(\.\d{1,2})?$/.test(trimmed); // e.g. "0" or "999999999"
    return looksLikeMoney ? RANGE_MESSAGE : 'Enter a valid dollar amount, like 125.50.';
  }
  if (cents < DEPOSIT_MIN_CENTS || cents > DEPOSIT_MAX_CENTS) return RANGE_MESSAGE;
  return undefined;
}

function DepositIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
    </svg>
  );
}

function CheckCircleIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

export function DepositCard({ accountNumber, balanceCents, onDeposited }: DepositCardProps) {
  const [amount, setAmount] = useState('');
  const [showErrors, setShowErrors] = useState(false); // only after blur or a submit attempt
  const [submitting, setSubmitting] = useState(false);

  const error = validateAmount(amount);
  const cents = error ? null : parseDollarsToCents(amount);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (cents === null) {
      setShowErrors(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await deposit({ accountNumber, amountCents: cents });
      notify.success(`Deposited ${formatCents(cents)}. New balance: ${formatCents(res.newBalanceCents)}.`);
      setAmount('');
      setShowErrors(false);
      onDeposited(res);
    } catch (err) {
      notify.error((err as Partial<ApiError>)?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-md border border-border bg-surface p-6"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-success-bg text-primary">
          <DepositIcon className="size-5" />
        </span>
        <div>
          <h2 className="text-title font-semibold text-text-main">Deposit funds</h2>
          <p className="text-small text-text-muted">Add money to your available balance.</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Input
          label="Deposit amount *"
          name="amount"
          inputMode="decimal"
          autoComplete="off"
          placeholder="$0.00"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          onBlur={() => amount.trim() !== '' && setShowErrors(true)}
          disabled={submitting}
          error={showErrors ? error : undefined}
        />
        {!(showErrors && error) && <p className="text-small text-text-muted">{RANGE_MESSAGE}</p>}
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="text-small text-text-muted">Balance after deposit</span>
        <span className="font-semibold tabular-nums text-text-main">
          {formatCents(balanceCents + (cents ?? 0))}
        </span>
      </div>

      {cents !== null && (
        <div role="status" className="flex gap-2 rounded-sm border-l-4 border-primary bg-success-bg p-4">
          <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium text-text-main">Ready to deposit</p>
            <p className="text-small text-text-muted">Valid deposits are reflected in your balance immediately.</p>
          </div>
        </div>
      )}

      <Button type="submit" fullWidth loading={submitting}>
        {submitting ? 'Processing deposit…' : cents !== null ? `Deposit ${formatCents(cents)}` : 'Deposit'}
        {!submitting && <DepositIcon className="size-4" />}
      </Button>
    </form>
  );
}
