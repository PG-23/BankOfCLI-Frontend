import mockAccount from '../mocks/mockAccount.json';
import type {
  Account,
  ApiError,
  ErrorCode,
  Transaction,
  TransactionResponse,
  WithdrawRequest,
} from '../models';
import { isValidCents } from '../utils/money';

const NETWORK_DELAY_MS = 900;

let currentAccount: Account = { ...mockAccount };

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function createTransactionId(): string {
  const date     = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const sequence = Date.now().toString().slice(-6);
  return `TXN-${date}-${sequence}`;
}

export class ApiServiceError extends Error {
  readonly code: ErrorCode;
  readonly field?: string;

  constructor(error: ApiError) {
    super(error.message);
    this.name  = 'ApiServiceError';
    this.code  = error.code;
    this.field = error.field;
  }
}

export async function getWithdrawAccount(): Promise<Account> {
  await delay(350);
  return { ...currentAccount };
}

export async function withdraw(
  request: WithdrawRequest,
): Promise<TransactionResponse> {
  await delay(NETWORK_DELAY_MS);

  if (!isValidCents(request.amountCents)) {
    throw new ApiServiceError({
      code:    'INVALID_AMOUNT',
      message: 'Enter a withdrawal amount greater than $0.00.',
      field:   'amountCents',
    });
  }

  if (request.accountNumber !== currentAccount.accountNumber) {
    throw new ApiServiceError({
      code:    'ACCOUNT_NOT_FOUND',
      message: 'The selected account could not be found.',
    });
  }

  if (request.amountCents > currentAccount.balanceCents) {
    throw new ApiServiceError({
      code:    'INSUFFICIENT_FUNDS',
      message: 'Insufficient funds for this withdrawal.',
      field:   'amountCents',
    });
  }

  currentAccount = {
    ...currentAccount,
    balanceCents: currentAccount.balanceCents - request.amountCents,
  };

  const transaction: Transaction = {
    id: createTransactionId(),
    type:              'withdrawal',
    amountCents:       request.amountCents,
    fromAccountNumber: request.accountNumber,
    toAccountNumber:   null,
    timestamp:         new Date().toISOString(),
  };

  return {
    transaction,
    newBalanceCents: currentAccount.balanceCents,
  };
}