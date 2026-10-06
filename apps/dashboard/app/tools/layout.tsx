import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-14">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-black">
          <div className="max-w-4xl mx-auto px-8 py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
