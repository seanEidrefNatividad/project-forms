'use client'
import { useState } from 'react'
import { createClient } from "@/lib/supabase/client";
import {useRouter} from 'next/navigation'

export default function CreateForm() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient()
  const router = useRouter()

  async function handleClick() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('forms')
        .insert({ title: 'Untitled' })
        .select()
        .limit(1)

      if (error) throw error;

      const {id} = data[0]
      if (id) {
        router.refresh()
        router.push(`/dashboard/${id}/forms`)
      }

    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button className='inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 text-white rounded hover:bg-blue-700 p-3 m-4 transition'
      onClick={() => handleClick()}
      disabled={isLoading}>
      {isLoading ? "Creating..." : "Create Form"}
    </button>
  )
}
