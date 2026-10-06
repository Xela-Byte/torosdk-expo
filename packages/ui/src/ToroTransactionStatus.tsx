import React from 'react';
import { useToroTransactionStatus } from '@reactforge/react';

export interface ToroTransactionStatusProps {
  hash: string;
  className?: string;
}

export const ToroTransactionStatus: React.FC<ToroTransactionStatusProps> = ({ hash, className = '' }) => {
  const { status, loading, error } = useToroTransactionStatus(hash);

  if (loading) return <span className={`text-gray-500 animate-pulse ${className}`}>Checking status...</span>;
  if (error) return <span className={`text-red-500 ${className}`}>Status unknown</span>;

  let colorClass = 'bg-gray-100 text-gray-800';
  if (status === 'success') colorClass = 'bg-green-100 text-green-800';
  if (status === 'failed') colorClass = 'bg-red-100 text-red-800';
  if (status === 'pending') colorClass = 'bg-yellow-100 text-yellow-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass} ${className}`}>
      {status}
    </span>
  );
};
