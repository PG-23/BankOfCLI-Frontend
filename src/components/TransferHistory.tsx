import React from "react";
import TransferHistoryRow from "./TransferHistoryRow";
import "./TransferHistory.css";
import {
  getTransactionsFromId,
  type TransactionFilter,
} from "../services/transactionService";
import type { Transaction } from "../models";

function TransferHistory() {
  // Dummy data for transaction history
  const [dummyData, setDummyData] = React.useState<Transaction[]>([]);
  const [totalPages, setTotalPages] = React.useState(0);

  // State for the current filter selection
  const [filter, setFilter] = React.useState<TransactionFilter>("all");

  /**************************************
   *            Pagination              *
   *************************************/
  const [page, setPage] = React.useState(0);

  // Fetch transactions whenever the filter or page changes
  React.useEffect(() => {
    let transactions;
    async function fetchData() {
      transactions = await getTransactionsFromId("1000001234", filter, page);
      setDummyData(transactions.transactions);
      setTotalPages(transactions.totalPages);
    }
    fetchData();

    console.log("Done");
  }, [filter, page]);

  // This will likely need to be replaced when get actual data but should be able to fit in just fine

  return (
    <>
      <div className="container">
        {/* Basic info + sorting capabilities */}
        <div className="header">
          <div className="text-title">Transactions</div>
          <div className="under-title">
            <div>Latest activity across your account.</div>

            {/* Drop down for sorting */}
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as TransactionFilter);
                setPage(0); // Reset to first page when filter changes
              }}
            >
              <option value="all">All Activity</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="transfer">Transfers</option>
            </select>
          </div>
        </div>

        <table>
          {/* Table header for transaction history */}
          <thead>
            <tr>
              <th className="text-base first-column">Transaction</th>
              <th className="text-base text-align-right">Date</th>
              <th className="text-base mid-column">Type</th>
              <th className="text-base text-align-left">Amount</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {/* Filter and map through the transaction data to display rows */}
            {dummyData.map((item, index) => (
              <TransferHistoryRow
                key={index}
                transaction={item}
                accountId={"1000001234"}
              />
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            className={page == 0 ? "hidden" : "show"}
          >
            Previous
          </button>
          <div>{page}</div>
          <button
            onClick={() => setPage(page + 1)}
            className={page == totalPages - 1 ? "hidden" : "show"}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default TransferHistory;
