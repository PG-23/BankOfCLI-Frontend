import "./AccountOverview.css";
import { useState } from "react";
import { formatCents } from "../utils/money";
import { BiCreditCard, BiUser, BiEnvelope } from "react-icons/bi";

function AccountOverview() {
    const [showAccountInfo, setShowAccountInfo] = useState(false);

    // Dummy data for demonstration purposes
    const dummyAccount = {
        balanceCents: 250000,
        accountNumber: "1000001234",
    };
    const dummyUser = {
        firstName: "Alice",
        lastName: "Smith",
        username: "asmith1234",
        email: "alice@bank.com",
    };

    return (
        <div className="container" id="dashboard">
            {/* Title Section */}
            <div className="title-container">
                <div className="title">Account Overview</div>
                <div className="user-name">
                    {dummyUser.firstName} {dummyUser.lastName}
                </div>
            </div>

            {/* Account details will go here */}
            <div className="account-balance">
                <div className="subtitle">Available Balance</div>
                <div className="amount">
                    {formatCents(dummyAccount.balanceCents)}
                </div>
            </div>

            {/* Account Details */}
            <div className="account-info">
                {/* The bracketed space ensures that no formatter will remove it. The space is good for readability */}
                {/* This will sensor the account number until the user presses a button to reveal everything */}
                <div>
                    <div className="row">
                        <div className="icon-row">
                            <BiCreditCard size={24} /> Account Number{" "}
                        </div>
                        {showAccountInfo ? (
                            dummyAccount.accountNumber
                        ) : (
                            // I cannot figure out why the first dot is lower than the others. Any of the fixes I try or other censor characters have the same fault
                            <>
                                {/* Censor all but the last 4 digits of the account number */}
                                {"•".repeat(
                                    dummyAccount.accountNumber.length - 4,
                                )}
                                {dummyAccount.accountNumber.substring(
                                    dummyAccount.accountNumber.length - 4,
                                    dummyAccount.accountNumber.length,
                                )}
                            </>
                        )}
                    </div>
                    <>
                        {showAccountInfo && (
                            <>
                                <div className="row">
                                    <div className="icon-row">
                                        <BiUser size={24} /> Username
                                    </div>
                                    <div>{dummyUser.username}</div>
                                </div>
                                <div className="row">
                                    <div className="icon-row">
                                        <BiEnvelope size={24} /> Email
                                    </div>
                                    <div>{dummyUser.email}</div>
                                </div>
                            </>
                        )}
                    </>
                </div>
                <button
                    className="link"
                    onClick={() => setShowAccountInfo(!showAccountInfo)}
                >
                    {showAccountInfo ? "Hide" : "Show"} Account Information{" "}
                </button>
            </div>
        </div>
    );
}

export default AccountOverview;
