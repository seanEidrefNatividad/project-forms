import { createClient } from "@/lib/supabase/server";

export async function fetchFilteredForms(
  query: string,
  currentPage: number
) {
    const supabase = await createClient()
    console.log(query,currentPage)
    //await new Promise((resolve)=>{setTimeout(resolve,3000)})
    const { data, error } = await supabase.rpc('fetch_filtered_forms');
    if (error) {
      console.error("Supabase RPC error:", {
        code: error.code, 
        details: error.details,
        hint: error.hint,
      });
      throw new Error(error.message || "RPC failed");
    }
    return data
  }