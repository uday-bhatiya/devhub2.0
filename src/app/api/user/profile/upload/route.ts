import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Helper
async function streamUpload(req: NextRequest) {
  const buffer = await req.arrayBuffer()

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      (error, result) => {
        if (result) resolve(result)
        else reject(error)
      }
    )

    const nodeBuffer = Buffer.from(buffer)
    const readable = Readable.from(nodeBuffer)
    readable.pipe(uploadStream)
  })
}

export async function POST(req: NextRequest) {
  try {
    const result = await streamUpload(req) as { secure_url: string }
    console.log(result.secure_url)
    return NextResponse.json({ url: result.secure_url })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
