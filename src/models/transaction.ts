export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

export interface Transaction {
  id: string;                       // e.g. "TXN-20261001-000123"
  type: TransactionType;
  amountCents: number;              // integer, always positive
  fromAccountNumber: string | null; // null for deposits
  toAccountNumber: string | null;   // null for withdrawals
  timestamp: string;                // ISO 8601
}

export interface DepositRequest {
  accountNumber: string;
  amountCents: number;
}

export interface WithdrawRequest {
  accountNumber: string;
  amountCents: number;
}

export interface TransferRequest {
  fromAccountNumber: string;
  toAccountNumber: string;
  amountCents: number;
}

export interface TransactionResponse {
  transaction: Transaction;
  newBalanceCents: number;
}