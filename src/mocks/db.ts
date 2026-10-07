import type { User, Account, Transaction } from '../models';
import usersData from './users.json';
import accountsData from './accounts.json';

export type MockUser = User & { password: string }; // password exists only in mocks

// Mutable copies shared by all services. Resets on page refresh.
export const db = {
  users: [...usersData] as MockUser[],
  accounts: [...accountsData] as Account[],
  transactions: [] as Transaction[], // seed data (transactions.json) arrives with the transaction-service PR
};

export const delay = (ms = 800) => new Promise(res => setTimeout(res, ms));