// export const runtime = 'nodejs';

// import { createClient } from "@/lib/supabase/server";
// import { notFound } from 'next/navigation';

export const revalidate = 0;

//export default async function Page(props: { params: Promise<{ id: string }> }) {
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  console.log(query)

  return (
    <div className="mx-auto max-w-screen-md">
      Access Denied
      {/* Access Denied. Would you like to Request Access?. */}
    </div>
  );
}