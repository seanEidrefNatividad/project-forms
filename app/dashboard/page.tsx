
import CreateForm from '@/components/ui/dashboard/create-form'
import FormTable from '@/components/ui/dashboard/table'
import { Suspense } from 'react';
import { FormsSkeleton } from '@/components/ui/skeletons';
export const revalidate = 0;

export default function Page() {
  return (
    <>
      <p>Dashboard Page</p>
      <Suspense fallback={<FormsSkeleton/>}>
        <FormTable query='' currentPage={1}/>
      </Suspense>
      <CreateForm/>
    </>
  );
}