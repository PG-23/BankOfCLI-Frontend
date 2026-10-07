import { useEffect, useState } from 'react';
import type { ApiError } from '../models';
import { DepositCard } from '../components/DepositCard';
import { useAuth } from '../hooks/useAuth';
import { getAccount } from '../services/accountService';
import { formatCents } from '../utils/money';

export function DepositPage() {
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
    <main className="mx-auto flex w-full max-w-[36rem] flex-col gap-lg p-md sm:p-lg">
      <div>
        <h1 className="text-heading font-bold text-text-main">Deposit</h1>
        {accountNumber && (
          <p className="text-small text-text-muted">
            Everyday account ••••{accountNumber.slice(-4)}
            {balanceCents !== null && <> · Available balance <span className="tabular-nums">{formatCents(balanceCents)}</span></>}
          </p>
        )}
      </div>

      {loadError ? (
        <p role="alert" className="rounded-sm bg-error-bg p-md text-error">{loadError}</p>
      ) : !accountNumber || balanceCents === null ? (
        // Skeleton while the mock service "loads" the account
        <div aria-busy="true" aria-label="Loading account" className="h-80 animate-pulse rounded-md border border-border bg-surface" />
      ) : (
        <DepositCard
          accountNumber={accountNumber}
          balanceCents={balanceCents}
          onDeposited={res => setBalanceCents(res.newBalanceCents)}
        />
      )}
    </main>
  );
}
