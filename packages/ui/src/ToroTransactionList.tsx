import React from 'react';
import { useToroTransactions } from '@reactforge/react';
import { formatToroTransaction, shortenAddress } from '@reactforge/sdk-adapter';

export interface ToroTransactionListProps {
  address?: string;
  count?: number;
  className?: string;
}

export const ToroTransactionList: React.FC<ToroTransactionListProps> = ({ address, count = 10, className = '' }) => {
  const { data, loading, error } = useToroTransactions(address, count);

  if (loading) return <div className={`p-4 text-gray-500 ${className}`}>Loading transactions...</div>;
  if (error) return <div className={`p-4 text-red-500 ${className}`}>Error loading transactions</div>;
  if (!data || data.length === 0) return <div className={`p-4 text-gray-500 ${className}`}>No transactions found.</div>;

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-3">Hash</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">From</th>
            <th className="px-4 py-3">To</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((rawTx, i) => {
            const tx = formatToroTransaction(rawTx);
            return (
              <tr key={tx.hash || i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-blue-600">{shortenAddress(tx.hash)}</td>
                <td className="px-4 py-3 font-medium">
                  {tx.amount} {tx.currency}
                </td>
                <td className="px-4 py-3 font-mono">{shortenAddress(tx.from)}</td>
                <td className="px-4 py-3 font-mono">{shortenAddress(tx.to)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tx.status === 'success' ? 'bg-green-100 text-green-800' :
                    tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
