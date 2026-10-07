# Withdraw Feature

This branch implements the frontend withdrawal flow for Bank of CLI Part 2.

## Included

- Mock account data loaded from `src/mocks/mockAccount.json`
- Service-based withdrawal logic in `src/services/withdrawService.ts`
- Client-side amount validation using the existing money utilities
- Insufficient-funds and invalid-account handling
- Confirmation modal before submitting a withdrawal
- Simulated network/loading state
- Success and error toast notifications
- Immediate balance update after a successful withdrawal
- A reusable `onWithdrawalComplete` callback for updating a future dashboard transaction list
- Responsive Tailwind styling
- Accessible labels, error messages, modal semantics, keyboard Escape support, and live toast feedback

## Main files

- `src/components/WithdrawForm.tsx`
- `src/components/ConfirmWithdrawModal.tsx`
- `src/components/Toast.tsx`
- `src/services/withdrawService.ts`
- `src/mocks/mockAccount.json`
- `src/pages/WithdrawDemoPage.tsx`

`App.tsx` currently renders `WithdrawDemoPage` so the feature can be tested by itself. When the team builds the real Transaction Center, import `WithdrawForm` there instead.

```tsx
import { WithdrawForm } from './components/WithdrawForm';

<WithdrawForm
  onWithdrawalComplete={(transaction, newBalanceCents) => {
    // Update dashboard balance and recent transactions here.
  }}
/>
```

## Mock behavior

The mock account starts with a balance of `$500.00` (`50000` cents). The service stores balance changes in memory while the app is running. Refreshing the page resets the mock account to the JSON value.

## Manual test cases

1. Withdraw `50` and confirm. Balance should become `$450.00` and a success toast should appear.
2. Enter `0`, a negative value, letters, or more than two decimal places. The form should reject the amount.
3. Enter an amount greater than the available balance. The form should show an insufficient-balance validation message.
4. Open the confirmation modal and press Cancel or Escape. No withdrawal should occur.
5. Confirm a valid withdrawal. The confirmation button should show a processing spinner while the mock service waits.
6. After success, the latest transaction card should show the withdrawal and the form should clear.

## Future backend swap

When the backend is ready, replace the internals of `withdraw()` and `getWithdrawAccount()` in `src/services/withdrawService.ts` with real API calls. `WithdrawForm` can remain mostly unchanged as long as the API continues to use `WithdrawRequest` and `TransactionResponse`.
