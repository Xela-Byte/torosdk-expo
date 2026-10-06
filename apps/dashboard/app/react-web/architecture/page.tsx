'use client';
import { PageHeader } from '@/components/PageHeader';
import { TryItLab } from '@/components/TryItLab';
import { CodeBlock } from '@/components/CodeBlock';

export default function ArchitecturePage() {
  const providerCode = `import { ToroProvider } from '@reactforge/sdk-adapter';

export default function App({ children }) {
  return (
    <ToroProvider 
      config={{ network: 'testnet' }}
      // Note: React Web does NOT use 'authStrategy' because browsers 
      // do not have a unified biometric hardware API like mobile devices.
    >
      {children}
    </ToroProvider>
  );
}`;

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <PageHeader 
        title="Web Architecture & Security" 
        description="Understanding how the React Web SDK manages state, keys, and networking." 
      />

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">How it works under the hood</h2>
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          The <code className="text-[#16A34A] bg-[#16A34A]/10 px-1.5 py-0.5 rounded font-mono">@reactforge/sdk-adapter</code> for web differs structurally from the React Native implementation. Web browsers operate in a heavily sandboxed environment. Because they lack direct access to hardware secure enclaves (like the iOS Keychain or Android Keystore), the Web SDK relies on in-memory state and encrypted local storage.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">1. Session Storage vs Hardware Keychains</h2>
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          On mobile, the <code className="text-white">expo-secure-store</code> securely holds wallet passwords across app restarts. On the web, maintaining passwords in <code className="text-white">localStorage</code> is a major security risk due to XSS (Cross-Site Scripting) attacks.
        </p>
        <ul className="space-y-3 text-sm text-[#a1a1aa]">
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">✓</span>
            <span><b>Encrypted Keystore:</b> The encrypted wallet keystore (which requires a password to decrypt) is safely saved in <code className="text-white">localStorage</code>.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">✓</span>
            <span><b>Volatile Passwords:</b> The actual password required to sign transactions is never stored persistently. It is kept in volatile React state or must be provided at the exact moment of signing (e.g., via the <code className="text-[#16A34A]">useToroSend</code> mutation).</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">✓</span>
            <span><b>Session Decay:</b> When the user closes the browser tab, the session is cleared, enforcing them to re-enter their password for the next transaction.</span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">2. No Biometric Gating on Web</h2>
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          Unlike React Native (which uses <code className="text-white">authStrategy</code> to trigger Face ID), standard desktop browsers do not have a uniform biometric API that can automatically intercept background mutations.
        </p>
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          Therefore, whenever your web app performs a sensitive action (like <code className="text-[#16A34A]">useToroSend</code> or <code className="text-[#16A34A]">useToroSwap</code>), your UI must explicitly ask the user for their password and pass it into the mutation variables:
        </p>
        <CodeBlock 
          code={`const { send } = useToroSend();

// The developer must build a UI to capture this password
send({
  receiverAddr: '0x123...',
  amount: '10',
  currency: 'TORO',
  senderPwd: userProvidedPassword // Required on web!
});`}
          language="tsx"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-white">3. Network & Caching Layer</h2>
        <p className="text-[#a1a1aa] mb-4 text-sm leading-relaxed">
          The Web SDK utilizes standard <code className="text-white">fetch()</code> coupled with an internal caching layer to minimize RPC calls to the Toronet blockchain. 
        </p>
        <ul className="space-y-3 text-sm text-[#a1a1aa]">
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">•</span>
            <span><b>Query De-duplication:</b> If 5 components render <code className="text-[#16A34A]">useToroBalance</code> for the same address, only one network request is made.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#16A34A] shrink-0">•</span>
            <span><b>Manual vs Auto Invalidation:</b> While the React Native SDK strictly enforces TanStack Query for automatic cache invalidation, the Web SDK allows you to manually call refetch methods exposed by the hooks (e.g., <code className="text-white">{"const { refetch } = useToroBalance()"}</code>) if you prefer managing state yourself.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
