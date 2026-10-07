import type { Transaction, TransactionType } from "../models";
import { db } from "../mocks/db";

const { transactions } = db;

export type TransactionFilter = TransactionType | "all";
export type PaginatedTransactions = {
  transactions: Transaction[];
  totalPages: number;
};

const pageSize = 3;

// Get all to retrieve transactions by id, type, and page.
// Returns a paginated list of transactions matching and the total pages that exist
export async function getTransactionsFromId(
  id: string,
  type: TransactionFilter = "all",
  page: number = 0,
): Promise<PaginatedTransactions> {
  const filteredTransactions = transactions.filter((transaction) => {
    const inAccount =
      transaction.fromAccountNumber === id ||
      transaction.toAccountNumber === id;
    if (type === "all") {
      return inAccount;
    }
    return inAccount && transaction.type === type;
  });
  const paginatedTransactions = filteredTransactions.slice(
    page * pageSize,
    (page + 1) * pageSize,
  );
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  return {
    transactions: paginatedTransactions,
    totalPages,
  };
}
