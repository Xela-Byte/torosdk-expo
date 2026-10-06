'use client';
import { PageHeader } from '../../../../components/PageHeader';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function UseToroStoragePage() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="useToroStorage"
        description="Query and mutate Toronet decentralized storage network settings."
      />
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Installation</h2>
        <CodeBlock code="import { useToroStorageQuery, useToroStorageMutation } from '@reactforge/react';" language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">What it does</h2>
        <p className="text-gray-400 mb-4">
          Wraps all endpoints from the Toronet <code>storage.ts</code> API. 
          <code>useToroStorageQuery</code> lets you check if storage is enabled, get the current version, verify registered contracts, and check the network owner. 
          <code>useToroStorageMutation</code> allows the owner to toggle storage, register contracts, change versions, and transfer ownership.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Usage Example</h2>
        <p className="text-gray-400 mb-4">Here is a complete example of how to query storage status and turn it on:</p>
        <CodeBlock code={`import { useToroStorageQuery, useToroStorageMutation } from '@reactforge/react';
import { useState } from 'react';

export function StorageManager() {
  const { isOn, version, owner, loading: queryLoading } = useToroStorageQuery();
  const { turnOn, loading: mutLoading, error } = useToroStorageMutation();
  const [password, setPassword] = useState('');

  if (queryLoading) return <p>Loading storage status...</p>;

  const handleTurnOn = async () => {
    try {
      await turnOn(password);
      alert('Storage enabled successfully!');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3>Storage Status: {isOn ? 'Enabled' : 'Disabled'}</h3>
      <p>Version: {version}</p>
      <p>Owner: {owner}</p>
      
      {!isOn && (
        <div className="mt-4">
          <input 
            type="password" 
            placeholder="Wallet Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button onClick={handleTurnOn} disabled={mutLoading}>
            {mutLoading ? 'Turning On...' : 'Enable Storage'}
          </button>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
    </div>
  );
}`} language="tsx" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Query Return value</h2>
        <CodeBlock code={`{
  isOn: boolean | null,
  version: string | number | null,
  owner: string | null,
  loading: boolean,
  error: Error | null,
  checkContract: (contract: string) => Promise<boolean>,
  checkIfOwner: (address: string) => Promise<boolean>,
  refetch: () => Promise<void>
}`} language="typescript" />
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Mutation Return value</h2>
        <CodeBlock code={`{
  loading: boolean,
  error: Error | null,
  turnOn: (pwd: string) => Promise<any>,
  turnOff: (pwd: string) => Promise<any>,
  registerContract: (pwd: string, contract: string) => Promise<any>,
  unregisterContract: (pwd: string, contract: string) => Promise<any>,
  increaseVersion: (pwd: string) => Promise<any>,
  decreaseVersion: (pwd: string) => Promise<any>,
  setVersion: (pwd: string, version: string | number) => Promise<any>,
  transferOwnership: (pwd: string, newOwner: string) => Promise<any>
}`} language="typescript" />
      </section>
    </div>
  );
}
