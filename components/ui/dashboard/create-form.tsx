'use client'
import { useState } from 'react'
import { createClient } from "@/lib/supabase/client";
// import Link from 'next/link'
// import {useRouter} from 'next/navigation'
// import { Form } from '@/src/types'

// type Formasd = {
//   id: string;
// }

export default function CreateForm() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient()
  // const router = useRouter()

  async function handleClick() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('forms')
        .insert({ title: 'Untitled' })
        .select()
        .limit(1)

      if (error) throw error;
      alert('form created!')
      console.log(data)
      console.log(data[0].id)

      // const {id} = data
      // if (data) {
      //   router.push(`/form/${data.id}`)
      // }

    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <button className='inline-flex items-center justify-center gap-2 rounded-md bg-blue-800 p-3 m-4 hover:bg-blue-600'
      onClick={() => handleClick()}
      disabled={isLoading}>
      {isLoading ? "Creating..." : "Create Form"}
    </button>
  )
}
