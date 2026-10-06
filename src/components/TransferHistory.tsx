import React from "react";
import TransferHistoryRow from "./TransferHistoryRow";
import "./TransferHistory.css";

function TransferHistory() {
  const dummyData = [
    {
      transaction: "Withdraw",
      date: "2024-06-01",
      type: "Withdraw",
      amount: -100,
    },
    {
      transaction: "Deposit",
      date: "2024-06-02",
      type: "Deposit",
      amount: 50,
    },
    {
      transaction: "Transfer",
      date: "2024-06-03",
      type: "Transfer",
      amount: -200,
    },
  ];

  const [filter, setFilter] = React.useState("all");

  return (
    <>
      <div className="container">
        {/* Basic info + sorting capabilities */}
        <div className="header">
          <div className="text-title">Transactions</div>
          <div className="under-title">
            <div>Latest activity across your account.</div>
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
              <th>Transaction</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {dummyData
              .filter((item) => {
                if (filter === "deposits") return item.type === "Deposit";
                if (filter === "withdrawals") return item.type === "Withdraw";
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
      </div>
    </>
  );
}

export default TransferHistory;
