'use client'

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: string
  autoFocus?: boolean
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error,
  autoFocus = true,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  // Convert value string to array of individual characters
  const valueArray = value.split('').slice(0, length)
  while (valueArray.length < length) {
    valueArray.push('')
  }

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  const focusInput = (index: number) => {
    if (index >= 0 && index < length && inputRefs.current[index]) {
      inputRefs.current[index]?.focus()
    }
  }

  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return

    // Only allow digits
    const digit = inputValue.replace(/\D/g, '').slice(-1)

    const newValueArray = [...valueArray]
    newValueArray[index] = digit
    const newValue = newValueArray.join('')

    onChange(newValue)

    // Move to next input if a digit was entered
    if (digit && index < length - 1) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      const newValueArray = [...valueArray]

      if (valueArray[index]) {
        // Clear current input
        newValueArray[index] = ''
        onChange(newValueArray.join(''))
      } else if (index > 0) {
        // Move to previous input and clear it
        newValueArray[index - 1] = ''
        onChange(newValueArray.join(''))
        focusInput(index - 1)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      focusInput(index - 1)
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      focusInput(index + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return

    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)

    if (pastedData) {
      onChange(pastedData.padEnd(length, '').slice(0, length))

      // Focus the input after the last pasted character
      const nextIndex = Math.min(pastedData.length, length - 1)
      focusInput(nextIndex)
    }
  }

  const handleFocus = (index: number) => {
    setFocusedIndex(index)
    // Select the input content on focus
    inputRefs.current[index]?.select()
  }

  const handleBlur = () => {
    setFocusedIndex(null)
  }

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2 sm:gap-3">
        {valueArray.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            disabled={disabled}
            className={cn(
              'w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-200',
              'focus:border-pink-500 focus:ring-4 focus:ring-pink-100',
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : focusedIndex === index
                ? 'border-pink-500'
                : digit
                ? 'border-pink-300 bg-pink-50'
                : 'border-gray-200',
              disabled && 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  )
}
