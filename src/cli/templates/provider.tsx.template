import React, { type ReactNode } from 'react';
import { ToronetProvider } from 'torosdk-expo';
import { config } from './config';
import { authStrategy } from './auth';

export function ToroWrapper({ children }: { children: ReactNode }) {
  return (
    <ToronetProvider config={config} authStrategy={authStrategy}>
      {children}
    </ToronetProvider>
  );
}
