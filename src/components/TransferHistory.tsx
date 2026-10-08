import React from "react";
import TransferHistoryRow from "./TransferHistoryRow";
import "./TransferHistory.css";
import {
    getTransactionsFromId,
    type TransactionFilter,
    PAGE_SIZE,
} from "../services/transactionService";
import type { Transaction } from "../models";

function TransferHistory() {
    // Dummy data for transaction history
    const [dummyData, setDummyData] = React.useState<Transaction[]>([]);
    const [totalPages, setTotalPages] = React.useState(0);

    // State for the current filter selection
    const [filter, setFilter] = React.useState<TransactionFilter>("all");

    /************************************************
     *            Pagination Variables              *
     ***********************************************/
    const [page, setPage] = React.useState(0);
    const startingPage = Math.max(
        0,
        Math.min(totalPages - 5, Math.max(0, page - 2)),
    );

    // Fetch transactions whenever the filter or page changes
    React.useEffect(() => {
        let transactions;
        async function fetchData() {
            transactions = await getTransactionsFromId(
                "1000001234",
                filter,
                page,
            );
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

                {/* Table for displaying transaction history */}
                <table>
                    {/* Table header for transaction history */}
                    <thead>
                        <tr>
                            <th className="text-base first-column">
                                Transaction
                            </th>
                            <th className="text-base text-align-right">Date</th>
                            <th className="text-base mid-column">Type</th>
                            <th className="text-base text-align-left">
                                Amount
                            </th>
                        </tr>
                    </thead>

                    {/* Body - Mostly handled by TransferHistoryRow component */}
                    <tbody>
                        {dummyData.map((item, index) => (
                            <TransferHistoryRow
                                key={index}
                                transaction={item}
                                accountId="1000001234"
                            />
                        ))}

                        {/* If there are no values */}
                        {Array.from({
                            length: Math.max(0, PAGE_SIZE - dummyData.length),
                        }).map((_, i) => (
                            <tr
                                key={i}
                                className="empty-row"
                                aria-hidden="true"
                            >
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Page Buttons*/}
                <div className="pagination">
                    <button
                        onClick={() => {
                            if (page > 0) setPage(page - 1);
                        }}
                        className={`nav ${page === 0 ? "invisible" : "active"}`}
                        disabled={page === 0}
                    >
                        Previous
                    </button>

                    {Array.from({ length: 5 }, (_, i) => {
                        const index = startingPage + i;
                        const isValid = index < totalPages;
                        const isCurrent = index === page;

                        if (totalPages === 1) return null;

                        return (
                            <button
                                key={index}
                                className={`page ${isCurrent ? "current" : "active"} ${isValid ? "" : "invisible"}`}
                                disabled={!isValid || totalPages === 1}
                                onClick={() => {
                                    if (isValid) setPage(index);
                                }}
                            >
                                {isValid ? index + 1 : "0"}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => {
                            if (page < totalPages - 1) setPage(page + 1);
                        }}
                        className={`nav ${page === totalPages - 1 ? "invisible" : "active"}`}
                        disabled={page === totalPages - 1}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}

export default TransferHistory;
