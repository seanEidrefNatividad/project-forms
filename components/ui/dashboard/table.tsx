
// import Image from 'next/image';
// import { useState } from 'react';
// import { createClient } from "@/lib/supabase/client";
import {fetchFilteredForms} from "@/lib/data"
import Link from "next/link";
// import type { FormList } from '@/src/types';

// import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
// import InvoiceStatus from '@/app/ui/invoices/status';
// import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';


export default async function FormTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // const [isLoading, setIsLoading] = useState(false)
  const forms = await fetchFilteredForms(query, currentPage);
  
  
  return (
    <div className="mt-6 flow-root mx-auto max-w-screen-md">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0 bg-card">
        
          <div className="md:hidden">
            {forms?.map((form) => (
              <div
                key={form.id}
                className="mb-2 w-full rounded-md p-4 border-b-2 border-background last-of-type:border-none"
              >
                <div className="flex items-center justify-between pb-4">
                  <p className="text-lg">{form.title}</p>
                </div>
                <div className="flex w-full items-center justify-between">
                  <div>
                    <p className="text-muted-foreground font-medium">
                      {form.owner_email}
                    </p>
                    {/* <p>{form.created_at}</p> */}
                  </div>
                  <div className="flex justify-end gap-2">
                     <Link href={`/dashboard/${form.id}/forms`}>
                      <button className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">
                  Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Owner
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {forms?.map((form) => (
                <tr
                  key={form.id}
                  className="w-full border-b-2 border-background text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    <p>{form.title}</p>
                  </td>
                   <td className="whitespace-nowrap px-3 py-3">
                    <p>{form.owner_email}</p>
                  </td>
                  <td className="py-2">
                  <Link href={`/dashboard/${form.id}/forms`}>
                    <button className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                      Edit
                    </button>
                  </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
