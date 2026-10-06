import React from 'react';

interface ToroBalanceProps {
    address?: string;
    className?: string;
    showAll?: boolean;
}
declare const ToroBalance: React.FC<ToroBalanceProps>;

interface ToroTokenBalanceProps {
    address?: string;
    className?: string;
}
declare const ToroTokenBalance: React.FC<ToroTokenBalanceProps>;

interface ToroTransactionListProps {
    address?: string;
    count?: number;
    className?: string;
}
declare const ToroTransactionList: React.FC<ToroTransactionListProps>;

interface ToroTransactionStatusProps {
    hash: string;
    className?: string;
}
declare const ToroTransactionStatus: React.FC<ToroTransactionStatusProps>;

interface ToroWalletProps {
    className?: string;
}
declare const ToroWallet: React.FC<ToroWalletProps>;

interface ToroTNSProps {
    className?: string;
    defaultMode?: 'resolve' | 'lookup';
}
declare const ToroTNS: React.FC<ToroTNSProps>;

interface ToroBridgeStatusProps {
    address?: string;
    className?: string;
}
declare const ToroBridgeStatus: React.FC<ToroBridgeStatusProps>;

export { ToroBalance, type ToroBalanceProps, ToroBridgeStatus, type ToroBridgeStatusProps, ToroTNS, type ToroTNSProps, ToroTokenBalance, type ToroTokenBalanceProps, ToroTransactionList, type ToroTransactionListProps, ToroTransactionStatus, type ToroTransactionStatusProps, ToroWallet, type ToroWalletProps };
