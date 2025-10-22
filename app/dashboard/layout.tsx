import TopNav from '@/components/ui/dashboard/top-nav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <div className="w-full">
        <TopNav />
      </div>
      <div className="w-full h-screen overflow-y-scroll p-1 md:p-6">
        {children}
      </div>
    </div>
  );
}