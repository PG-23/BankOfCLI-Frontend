import type {
  Account,
  ApiError,
  Transaction,
  TransactionResponse,
  WithdrawRequest,
} from '../models';
import { db, delay } from '../mocks/db';
import { isValidCents } from '../utils/money';

const fail = (code: ApiError['code'], message: string, field?: string): never => {
  throw { code, message, field } satisfies ApiError;
};

function createTransactionId(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const sequence = Date.now().toString().slice(-6);
  return `TXN-${date}-${sequence}`;
}

export async function getWithdrawAccount(accountNumber: string): Promise<Account> {
  await delay(350);

  const account = db.accounts.find(item => item.accountNumber === accountNumber);
  if (!account) {
    fail('ACCOUNT_NOT_FOUND', 'The selected account could not be found.');
  }

  return { ...account! };
}

export async function withdraw(request: WithdrawRequest): Promise<TransactionResponse> {
  await delay();

  if (!isValidCents(request.amountCents)) {
    fail('INVALID_AMOUNT', 'Enter a withdrawal amount greater than $0.00.', 'amountCents');
  }

  const account = db.accounts.find(item => item.accountNumber === request.accountNumber);
  if (!account) {
    fail('ACCOUNT_NOT_FOUND', 'The selected account could not be found.');
  }

  if (request.amountCents > account!.balanceCents) {
    fail('INSUFFICIENT_FUNDS', 'Insufficient funds for this withdrawal.', 'amountCents');
  }

  account!.balanceCents -= request.amountCents;

  const transaction: Transaction = {
    id: createTransactionId(),
    type: 'withdrawal',
    amountCents: request.amountCents,
    fromAccountNumber: request.accountNumber,
    toAccountNumber: null,
    timestamp: new Date().toISOString(),
  };

  // When the shared transaction store/service lands in develop, this transaction
  // can be appended there without changing the WithdrawForm contract.
  return {
    transaction,
    newBalanceCents: account!.balanceCents,
  };
}
