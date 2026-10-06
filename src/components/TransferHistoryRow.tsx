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
      <td className="flex flex-row items-center">
        {type === "Deposit" ? <ArrowDownCircleFill className="green" /> : null}
        {type === "Withdraw" ? <ArrowUpCircleFill className="red" /> : null}
        {type === "Transfer" ? (
          <ArrowLeftRight className={`${amount > 0 ? "green" : "red"}`} />
        ) : null}
        {transaction}
      </td>
      <td>{date}</td>
      <td>{type}</td>
      <td className={`${amount >= 0 ? "green" : "red"}`}>
        {Number(amount) >= 0
          ? `+ $${Math.abs(amount)}`
          : `- $${Math.abs(amount)}`}
      </td>
    </tr>
  );
}

export default TransferHistoryRow;
