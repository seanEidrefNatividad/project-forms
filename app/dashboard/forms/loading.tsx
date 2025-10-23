import { FormsSkeleton } from '@/components/ui/skeletons';
 
export default function Loading() {
  return <div className="mx-auto max-w-screen-md w-full h-screen">
    <FormsSkeleton/>
  </div>
}