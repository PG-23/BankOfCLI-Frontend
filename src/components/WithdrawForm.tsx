import { type FormEvent, useEffect, useState } from 'react';
import type { Account, Transaction } from '../models';
import { Button, Input, Modal, Spinner } from './ui';
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

export function WithdrawForm({ onWithdrawalComplete }: WithdrawFormProps) {
  const { account: authAccount } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();
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

    setFieldError(undefined);
    return amountCents;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account || isProcessing) return;

    const amountCents = validateAmount();
    if (amountCents === null) return;

    setPendingAmountCents(amountCents);
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
      setFieldError(undefined);
      setIsConfirmOpen(false);
      setPendingAmountCents(null);

      notify.success(
        `Withdrawal successful. New balance: ${formatCents(response.newBalanceCents)}.`,
      );
      onWithdrawalComplete?.(response.transaction, response.newBalanceCents);
    } catch (error) {
      const apiError = getApiError(error);
      if (apiError?.field === 'amountCents') {
        setFieldError(apiError.message);
      } else {
        notify.error(apiError?.message ?? 'The withdrawal could not be completed. Please try again.');
      }
      setIsConfirmOpen(false);
      setPendingAmountCents(null);
    } finally {
      setIsProcessing(false);
    }
  }

  if (isLoadingAccount) {
    return (
      <section
        id="withdraw"
        className="w-full max-w-[30rem] rounded-md border border-border bg-surface p-6 shadow-sm sm:p-8"
      >
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-text-muted">
          <Spinner className="h-6 w-6 text-primary" />
          <p className="text-base">Loading account...</p>
        </div>
      </section>
    );
  }

  if (!account) {
    return (
      <section
        id="withdraw"
        className="w-full max-w-[30rem] rounded-md border border-error bg-error-bg p-6 shadow-sm sm:p-8"
      >
        <h2 className="text-title font-semibold text-text-main">Account unavailable</h2>
        <p className="mt-2 text-base text-text-muted">
          We could not load the account needed for withdrawals.
        </p>
      </section>
    );
  }

  return (
    <>
      <section
        id="withdraw"
        className="w-full max-w-[30rem] rounded-md border border-border bg-surface p-6 shadow-sm sm:p-8"
      >
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.16em] text-primary">
            Transaction Center
          </p>
          <h2 className="mt-2 text-title font-semibold text-text-main">Withdraw funds</h2>
          <p className="mt-1 text-base text-text-muted">
            Choose an amount to withdraw from your Bank of CLI account.
          </p>
        </header>

        <div className="mt-6 rounded-md border border-primary/20 bg-success-bg p-4">
          <p className="text-small font-semibold uppercase tracking-[0.12em] text-primary-strong">
            Available balance
          </p>
          <p className="mt-1 text-heading font-bold leading-tight text-text-main">
            {formatCents(account.balanceCents)}
          </p>
          <p className="mt-1 text-small text-text-muted">
            Account ending in {account.accountNumber.slice(-4)}
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <Input
              id="withdraw-amount"
              name="withdrawAmount"
              label="Withdrawal amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={amount}
              onChange={event => {
                setAmount(event.target.value);
                if (fieldError) setFieldError(undefined);
              }}
              disabled={isProcessing}
              error={fieldError}
              className="text-title font-semibold"
            />
            <p className="mt-1 text-small text-text-muted">
              Enter a positive dollar amount with no more than two decimal places.
            </p>
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={account.balanceCents <= 0}
          >
            Review withdrawal
          </Button>
        </form>
      </section>

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
                {isProcessing ? 'Processing...' : 'Confirm withdrawal'}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
