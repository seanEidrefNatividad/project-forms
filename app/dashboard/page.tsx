
import CreateForm from '@/components/ui/dashboard/create-form'
import FormTable from '@/components/ui/dashboard/table'
import { Suspense } from 'react';
import { FormsSkeleton } from '@/components/ui/skeletons';
export const revalidate = 0;

export default function Page() {
  return (
    <>
      <div className='max-w-5xl mx-auto'>
        <div>
          <span className='text-xs'>Sean Eidref Natividad&apos;s</span>
          <p className='text-lg'>
            Forms | Dashboard
          </p>
        </div>

        <Suspense fallback={<FormsSkeleton/>}>
          <FormTable query='' currentPage={1}/>
        </Suspense>

        <div className='hidden md:block flex justify-end bg-background mt-6'>
          <CreateForm/>
        </div>

        <div className='sm:hidden flex justify-center bg-background absolute inset-x-0 bottom-0 h-10'>
          <div className='relative inset-x-0 bottom-7'>
            <CreateForm/>
          </div>
        </div>

      </div>
    </>
  );
}