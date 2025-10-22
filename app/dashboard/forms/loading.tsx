import DashboardSkeleton from '@/components/ui/skeletons';
 
export default function Loading() {
  return <div className="mx-auto max-w-screen-md bg-red-500 w-full h-screen">
    <DashboardSkeleton/>
  </div>
}