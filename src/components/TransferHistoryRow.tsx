import {
  ArrowDownCircleFill,
  ArrowUpCircleFill,
  ArrowLeftRight,
} from "react-bootstrap-icons";

function TransferHistoryRow({
  transaction,
  date,
  type,
  amount,
}: {
  transaction: string;
  date: string;
  type: string;
  amount: number;
}) {
  return (
    <tr>
      {/* Icon indicating the type of transaction */}
      {/* Green indicates money coming into account, red out of it */}
      <td className="flex flex-row items-center">
        {type === "Deposit" ? (
          <ArrowDownCircleFill className="green icon" />
        ) : null}
        {type === "Withdraw" ? (
          <ArrowUpCircleFill className="red icon" />
        ) : null}
        {type === "Transfer" ? (
          <ArrowLeftRight className={`${amount > 0 ? "green" : "red"} icon`} />
        ) : null}
        {transaction}
      </td>
      <td>{date}</td>
      <td>{type}</td>

      {/* Number indicating money in or out of account, color coded to indicate */}
      <td className={`${amount >= 0 ? "green" : "red"}`}>
        {Number(amount) >= 0
          ? `+ $${Math.abs(amount)}`
          : `- $${Math.abs(amount)}`}
      </td>
    </tr>
  );
}

export default TransferHistoryRow;
