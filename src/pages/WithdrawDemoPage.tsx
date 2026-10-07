import      { useState } from 'react';
import type { Transaction } from '../models';
import      { WithdrawForm } from '../components/WithdrawForm';
import      { formatCents } from '../utils/money';

export function WithdrawDemoPage() {
  const [latestTransaction, setLatestTransaction] =
    useState<Transaction | null>(null);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <WithdrawForm
          onWithdrawalComplete={(transaction) => {
            setLatestTransaction(transaction);
          }}
        />

        {latestTransaction && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Latest transaction
            </p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold capitalize text-slate-900">
                  {latestTransaction.type}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(latestTransaction.timestamp).toLocaleString()}
                </p>
              </div>
              <p className="font-bold text-red-600">
                -{formatCents(latestTransaction.amountCents)}
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
