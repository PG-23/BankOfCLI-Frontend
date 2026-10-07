import React from "react";
import TransferHistoryRow from "./TransferHistoryRow";
import "./TransferHistory.css";

function TransferHistory() {
  // Dummy data for transaction history
  const dummyData = [
    {
      transaction: "Withdraw0",
      date: "2024-06-01",
      type: "Withdraw",
      amount: -100,
    },
    {
      transaction: "Deposit0",
      date: "2024-06-02",
      type: "Deposit",
      amount: 50,
    },
    {
      transaction: "Transfer0",
      date: "2024-06-03",
      type: "Transfer",
      amount: -200,
    },
    {
      transaction: "Withdraw1",
      date: "2024-06-01",
      type: "Withdraw",
      amount: -100,
    },
    {
      transaction: "Deposit1",
      date: "2024-06-02",
      type: "Deposit",
      amount: 50,
    },
    {
      transaction: "Transfer1",
      date: "2024-06-03",
      type: "Transfer",
      amount: -200,
    },
    {
      transaction: "Withdraw2",
      date: "2024-06-01",
      type: "Withdraw",
      amount: -100,
    },
    {
      transaction: "Deposit2",
      date: "2024-06-02",
      type: "Deposit",
      amount: 50,
    },
    {
      transaction: "Transfer2",
      date: "2024-06-03",
      type: "Transfer",
      amount: -200,
    },
  ];

  /**************************************
   *            Pagination              *
   *************************************/
  const totalRowsPerPage = 3; // Can be configured
  const totalPages = 2; // Can be configured
  const [page, setPage] = React.useState(0);

  // This will likely need to be replaced when get actual data but should be able to fit in just fine
  const slice = dummyData.slice(
    page * totalRowsPerPage,
    (page + 1) * totalRowsPerPage,
  );

  // State for the current filter selection
  const [filter, setFilter] = React.useState("all");

  return (
    <>
      <div className="container">
        {/* Basic info + sorting capabilities */}
        <div className="header">
          <div className="text-title">Transactions</div>
          <div className="under-title">
            <div>Latest activity across your account.</div>

            {/* Drop down for sorting */}
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Activity</option>
              <option value="deposits">Deposits</option>
              <option value="withdrawals">Withdrawals</option>
            </select>
          </div>
        </div>

        {/* Were transaction rows would go */}
        <table>
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
            {slice
              .filter((item) => {
                if (filter === "deposits") return item.amount > 0;
                if (filter === "withdrawals") return item.amount < 0;
                return true;
              })
              .map((item, index) => (
                <TransferHistoryRow
                  key={index}
                  transaction={item.transaction}
                  date={item.date}
                  type={item.type}
                  amount={item.amount}
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
            className={page == totalPages ? "hidden" : "show"}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default TransferHistory;
