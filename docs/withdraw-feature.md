# Withdraw Feature

This branch implements the frontend withdrawal flow for Bank of CLI Part 2 and is aligned with the shared UI and mock-data patterns currently in `develop`.

## Included

- Reuses the shared `Button`, `Input`, `Modal`, and `Spinner` components from `src/components/ui`
- Uses the shared Sonner notification helper in `src/utils/notify.ts`
- Reads and updates account data through the shared in-memory mock database in `src/mocks/db.ts`
- Uses the authenticated account from `AuthContext`
- Client-side amount validation using the existing money utilities
- Insufficient-funds and invalid-account handling
- Confirmation modal before submitting a withdrawal
- Simulated network/loading state
- Success and error notifications
- Immediate local balance update after a successful withdrawal
- A reusable `onWithdrawalComplete` callback for the future dashboard/transaction-history integration
- Styling based on the shared Bank of CLI design tokens in `src/index.css`

## Main files

- `src/components/WithdrawForm.tsx`
- `src/services/withdrawService.ts`

## Dashboard integration

The form is designed to be rendered inside the authenticated dashboard. `App.tsx` is intentionally not changed by this feature branch so it does not overwrite the dashboard work owned by another teammate.

```tsx
import { WithdrawForm } from './components/WithdrawForm';

<WithdrawForm
  onWithdrawalComplete={(transaction, newBalanceCents) => {
    // Refresh recent transactions / dashboard balance here when those shared features are ready.
  }}
/>
```

The root card has `id="withdraw"`, so it works with the shared navbar's current scroll-to-section behavior when mounted on the dashboard.

## Mock behavior

`withdrawService.ts` uses `db.accounts` from `src/mocks/db.ts`. The mock database is held in memory, so balances reset to `src/mocks/accounts.json` when the page refreshes.

The shared transaction collection/service is not in `develop` yet. The service still returns a valid `TransactionResponse` and the `onWithdrawalComplete` callback provides the created transaction so it can be connected to the shared transaction history once that work is merged.

## Manual test cases

1. Log in with a seeded mock user, open the dashboard with `WithdrawForm` mounted, and enter a valid amount such as `50`.
2. Select **Review withdrawal** and verify the shared modal shows the withdrawal amount and projected balance.
3. Select **Confirm withdrawal** and verify the shared loading state appears, the balance changes, and a success notification appears.
4. Enter `0`, a negative value, letters, or more than two decimal places. The form should reject the amount.
5. Enter an amount greater than the available balance. The form should display an insufficient-balance validation message.
6. Open the confirmation modal and select **Cancel** or press Escape. No withdrawal should occur.

## Future backend / transaction-store swap

When the shared transaction service or real backend is ready, update the internals of `withdraw()` and `getWithdrawAccount()` in `src/services/withdrawService.ts`. `WithdrawForm` can remain mostly unchanged as long as the contract continues to use `WithdrawRequest` and `TransactionResponse`.
