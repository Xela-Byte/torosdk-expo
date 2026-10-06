import { PageHeader } from '@/components/PageHeader';
import { CodeBlock } from '@/components/CodeBlock';

export default function RolesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader 
        title="Admin Roles & Verification"
        description="Verify on-chain roles for addresses and manage admin hierarchies on Toronet."
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Overview</h2>
        <p className="text-gray-400">
          Toronet incorporates a permissioned hierarchy for special functions (like adding nodes, creating currency, and modifying system properties). The <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">useToroAddressRole</code> and <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">useToroRoleMutations</code> hooks allow you to query and manage these roles.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">useToroAddressRole</h2>
        <p className="text-gray-400">
          This query hook determines the role of any address and validates its format. Returns the role as a string (e.g., 'superadmin', 'admin', 'user').
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useToroAddressRole } from '@reactforge/react';

export function RoleChecker({ address }) {
  const { role, isValid, loading, error } = useToroAddressRole(address);

  if (loading) return <div>Checking role...</div>;
  if (!isValid) return <div>Invalid address format</div>;

  return <div>Role: {role}</div>;
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">useToroRoleMutations</h2>
        <p className="text-gray-400">
          This mutation hook provides functions to query specific roles and add/remove admins. Note that adding an admin requires Super Admin credentials.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useToroRoleMutations } from '@reactforge/react';

export function AdminPanel() {
  const { addAdmin, removeAdmin, loading } = useToroRoleMutations();

  const handleAddAdmin = async () => {
    try {
      await addAdmin(
        "SUPER_ADMIN_ADDRESS", 
        "SUPER_ADMIN_PASSWORD", 
        "NEW_ADMIN_ADDRESS"
      );
      alert("Admin added successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleAddAdmin} disabled={loading}>
      {loading ? 'Adding...' : 'Add Admin'}
    </button>
  );
}`}
        />
      </section>

    </div>
  );
}
