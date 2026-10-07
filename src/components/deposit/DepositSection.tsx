import { useEffect, useState } from 'react';
import type { ApiError } from '../../models';
import { useAuth } from '../../hooks/useAuth';
import { getAccount } from '../../services/accountService';
import { DepositCard } from './DepositCard';

type DepositSectionProps = {
  onDeposited?: (newBalanceCents: number) => void; // e.g. let the dashboard refresh its balance
};

// Drop-in deposit feature for the dashboard. Loads the logged-in user's current balance,
// then shows the deposit form. id="deposit" is the target of the navbar's "Deposit" button.
export function DepositSection({ onDeposited }: DepositSectionProps) {
  const { account } = useAuth();
  const accountNumber = account?.accountNumber;
  const [balanceCents, setBalanceCents] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountNumber) return;
    let cancelled = false;
    getAccount(accountNumber)
      .then(a => !cancelled && setBalanceCents(a.balanceCents))
      .catch((err: Partial<ApiError>) => !cancelled && setLoadError(err.message ?? 'Could not load your account.'));
    return () => {
      cancelled = true;
    };
  }, [accountNumber]);

  return (
    <section id="deposit" className="w-full">
      {loadError ? (
        <p role="alert" className="rounded-sm bg-error-bg p-4 text-error">{loadError}</p>
      ) : !accountNumber || balanceCents === null ? (
        // Skeleton while the mock service "loads" the account
        <div aria-busy="true" aria-label="Loading account" className="h-80 animate-pulse rounded-md border border-border bg-surface" />
      ) : (
        <DepositCard
          accountNumber={accountNumber}
          balanceCents={balanceCents}
          onDeposited={res => {
            setBalanceCents(res.newBalanceCents);
            onDeposited?.(res.newBalanceCents);
          }}
        />
      )}
    </section>
  );
}
