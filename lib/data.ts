import { createClient } from "@/lib/supabase/server";

export async function fetchFilteredForms(
  query: string,
  currentPage: number
) {
    const supabase = await createClient()
    console.log(query,currentPage)
    try {
      // setIsLoading(true);

      // await new Promise((resolve)=>{setTimeout(resolve,3000)})
      const { data: { user }, error: e1} = await supabase.auth.getUser();
      if (!user || e1) { // not working, only show next thrown errors in dev or do nothing in Development
        if (e1) throw e1;
        if (!user) return []
      }

      const { data, error } = await supabase.rpc('fetch_filtered_forms');

      if (error) throw error;
      console.log('form created!')
      console.log(data)
      console.log(data[0].id)
      return data

    } catch (error: unknown) {
      console.log(error instanceof Error ? error.message : "An error occurred");
    } finally {
      // setIsLoading(false);
    }
  }