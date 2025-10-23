import { createClient } from "@/lib/supabase/client";

export async function fetchFilteredForms(
  query: string,
  currentPage: number
) {
    const supabase = createClient()
    console.log(query,currentPage)
    try {
      // setIsLoading(true);

      await new Promise((resolve)=>{setTimeout(resolve,3000)})
      
      const { data, error } = await supabase
        .from('forms')
        .select()

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