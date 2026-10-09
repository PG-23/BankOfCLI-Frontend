import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { getAccountActivity } from '../../services/activityService';
import { groupByMonth, type MonthActivity } from '../../utils/activity';
import { formatCents } from '../../utils/money';
import { Skeleton } from '../ui/Skeleton';

// Y-axis labels: whole dollars with commas, e.g. "$2,000"
const formatAxis = (cents: number) => `$${Math.round(cents / 100).toLocaleString('en-US')}`;

export function ActivityChart() {
  const { account } = useAuth();
  const [data, setData] = useState<MonthActivity[] | null>(null); // null = still loading

  // Load this account's transactions once, then group them by month
  useEffect(() => {
    if (!account) return;
    getAccountActivity(account.accountNumber).then(transactions => {
      setData(groupByMonth(transactions, account.accountNumber));
    });
  }, [account]);

  return (
    <div className="rounded-md border border-border bg-surface p-6">
      <h2 className="text-title font-semibold text-text-main">Transaction activity</h2>
      <p className="text-small text-text-muted">Deposits, withdrawals, and outgoing transfers over the last 6 months.</p>

      <div className="mt-4 h-64">
           {data === null ? (
          <Skeleton className="h-full w-full" />
        ) : data.every(m => m.deposits === 0 && m.withdrawals === 0 && m.transfers === 0) ? (
          // New account / no transactions: a message instead of an empty chart full of $0 labels
          <div className="flex h-full items-center justify-center">
            <p className="text-small text-text-muted">No activity in the last 6 months yet.</p>
          </div>
        ) : (
          // ResponsiveContainer: the chart fills the box and resizes with the window
          <ResponsiveContainer width="100%" height="100%">
            {/* barGap 2: a 2px gap between the 3 bars in each month */}
            <BarChart data={data} barGap={2} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
              {/* Horizontal hairline grid only, in the border grey so it stays in the background */}
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false}
                     tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
              <YAxis tickFormatter={formatAxis} axisLine={false} tickLine={false} width={64}
                     tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
              {/* Hover a month: shows all 3 values. cursor = light band behind the hovered month */}
              <Tooltip
                formatter={value => formatCents(Number(value))}
                cursor={{ fill: 'var(--color-background)' }}
                contentStyle={{ borderRadius: 8, borderColor: 'var(--color-border)' }}
              />
              {/* Legend text stays grey; only the small dot carries the colour */}
              <Legend iconType="circle"
                      formatter={label => <span className="text-small text-text-muted">{label}</span>} />
              {/* maxBarSize 24: bars never get fatter than 24px. radius: rounded top, square bottom */}
              <Bar dataKey="deposits" name="Deposits" fill="var(--color-chart-deposit)" maxBarSize={24} radius={[4, 4, 0, 0]} />
              <Bar dataKey="withdrawals" name="Withdrawals" fill="var(--color-chart-withdrawal)" maxBarSize={24} radius={[4, 4, 0, 0]} />
              <Bar dataKey="transfers" name="Transfers" fill="var(--color-chart-transfer)" maxBarSize={24} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
