import { PageHeader } from '@/components/PageHeader';
import { CodeBlock } from '@/components/CodeBlock';

export default function ProductsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader 
        title="Toronet Products"
        description="Register and manage merchant products natively on the Toronet blockchain."
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Overview</h2>
        <p className="text-gray-400">
          Toronet includes built-in smart contracts for decentralized e-commerce and point-of-sale systems. The <code className="bg-gray-800 px-1.5 py-0.5 rounded text-[#16A34A]">useToroProducts</code> hook allows merchants to register products directly to their wallet address, and allows users to query those products.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Creating a Product</h2>
        <p className="text-gray-400">
          Merchants can record products onto the blockchain. These products are permanently tied to their wallet address.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useToroProducts } from '@reactforge/react';

export function CreateProduct() {
  const { createProduct, loading } = useToroProducts();

  const handleCreate = async () => {
    await createProduct({
      productId: "PROD-12345",
      productName: "Premium Coffee Subscription",
      description: "1-year access to premium coffee deliveries.",
      productImage: "https://example.com/coffee.png",
      admin: "MERCHANT_WALLET_ADDRESS",
      adminpwd: "MERCHANT_PASSWORD"
    });
  };

  return <button onClick={handleCreate} disabled={loading}>Create Product</button>;
}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Querying Products</h2>
        <p className="text-gray-400">
          You can fetch a specific product by its ID and merchant address.
        </p>

        <CodeBlock
          language="tsx"
          code={`const { getProduct } = useToroProducts();

// Fetch product details
const product = await getProduct("PROD-12345", "MERCHANT_WALLET_ADDRESS", "MERCHANT_PASSWORD");
console.log(product.productName);`}
        />
      </section>
    </div>
  );
}
