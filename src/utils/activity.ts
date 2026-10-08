import type { Transaction } from '../models';

export interface MonthActivity{
    month:string;
    deposits:number;
    withdrawals:number;
    transfers:number;
}

// Turns a list of transactions into totals per month for the last `months` months.
// Months with no activity still appear (with zeros), so the chart has no gaps.

export function groupByMonth(transactions:Transaction[],accountNumber:string,months=6) : MonthActivity[] {
    const now = new Date();

    const result: (MonthActivity & { key:string }) [] = [];
        for(let i = months - 1; i >= 0; i--){
            const d = new Date(now.getFullYear(), now.getMonth()- i,1);
            result.push({
                key: `${d.getFullYear()}-${d.getMonth()}`,              // "2026-9", to match transactions
                month: d.toLocaleDateString('en-US', {month:'short'}),
                deposits : 0,
                withdrawals:0,
                transfers:0,
            });
        }

        // Add each transaction's amount to its month and type
        for(const t of transactions){
            const d = new Date(t.timestamp);
            const bucket = result.find(m=>m.key === `${d.getFullYear()}-${d.getMonth()}`);
            if (!bucket) continue;

            if(t.type === 'deposit') bucket.deposits += t.amountCents;
            else if (t.type === 'withdrawal') bucket.withdrawals += t.amountCents;
            else if (t.type === 'transfer' && t.fromAccountNumber === accountNumber){
                bucket.transfers += t.amountCents;
            }
        }
        return result.map(({ key: _key, ...rest }) => rest);



    
}