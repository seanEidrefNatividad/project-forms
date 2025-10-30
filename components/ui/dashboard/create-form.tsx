'use client'
import { useState } from 'react'
import {createForm} from '@/lib/actions'

export default function CreateForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    createForm()
  }

  return (
    <button className='inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 text-white rounded hover:bg-blue-700 p-3 m-4 transition'
      onClick={() => handleClick()}
      disabled={isLoading}>
      {isLoading ? "Creating..." : "Create Form"}
    </button>
  )
}
