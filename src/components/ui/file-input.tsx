'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
export interface FileInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'onChange'
  > {
  onValueChange?: (file: File | null) => void
  value?: File | null
  preview?: boolean
  previewUrl?: string | null
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    { className, onValueChange, value, preview = true, previewUrl, ...props },
    ref
  ) => {
    const [previewSrc, setPreviewSrc] = React.useState<string | null>(
      previewUrl || null
    )
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Update preview when previewUrl prop changes (for existing images)
    React.useEffect(() => {
      if (previewUrl) {
        setPreviewSrc(previewUrl)
      }
    }, [previewUrl])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null

      if (file && preview) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewSrc(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else if (!file) {
        setPreviewSrc(previewUrl || null)
      }

      onValueChange?.(file)
    }

    const handleClear = () => {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      setPreviewSrc(previewUrl || null)
      onValueChange?.(null)
    }

    const handleRemoveExisting = () => {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      setPreviewSrc(null)
      onValueChange?.(null)
    }

    return (
      <div className="space-y-4">
        {previewSrc && preview && (
          <div className="relative inline-block">
            <Image
              src={previewSrc}
              alt="Preview"
              className="h-32 w-32 rounded-lg object-cover border"
              width={128}
              height={128}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={value ? handleClear : handleRemoveExisting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Input
          type="file"
          className={cn('', className)}
          ref={(node) => {
            // Handle both refs
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
            if (node) {
              inputRef.current = node
            }
          }}
          onChange={handleFileChange}
          {...props}
        />
      </div>
    )
  }
)

FileInput.displayName = 'FileInput'

export { FileInput }
