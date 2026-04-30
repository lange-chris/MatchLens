import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'Missing candidate id.' }, { status: 400 })
  }

  // 1. Fetch the candidate to get the cv_url (for Storage cleanup)
  const { data: candidate, error: fetchError } = await supabase
    .from('candidates')
    .select('cv_url')
    .eq('id', id)
    .single()

  if (fetchError || !candidate) {
    return NextResponse.json({ error: 'Candidate not found.' }, { status: 404 })
  }

  // 2. Delete CV file from Supabase Storage (if a URL is stored)
  if (candidate.cv_url) {
    try {
      // Extract the storage path from the full URL
      // e.g. "https://.../storage/v1/object/public/cvs/filename.pdf" → "filename.pdf"
      const url = new URL(candidate.cv_url)
      const pathParts = url.pathname.split('/object/public/')
      if (pathParts.length === 2) {
        const [bucketAndPath] = pathParts[1].split('/')
        const bucket = bucketAndPath
        const filePath = pathParts[1].replace(`${bucket}/`, '')
        await supabase.storage.from(bucket).remove([filePath])
      }
    } catch {
      // Non-fatal: if storage cleanup fails, still delete the DB record
      console.warn(`Could not delete CV file for candidate ${id}`)
    }
  }

  // 3. Delete the candidate record from the database
  //    (cascades to any related rows if FK constraints are set up)
  const { error: deleteError } = await supabase
    .from('candidates')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
