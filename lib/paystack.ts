// Paystack types
export interface PaystackConfig {
  publicKey: string
  email: string
  amount: number // in kobo (smallest currency unit)
  currency: string
  reference: string
  metadata?: Record<string, any>
  onSuccess: (response: PaystackSuccessResponse) => void
  onCancel: () => void
}

export interface PaystackSuccessResponse {
  reference: string
  trans: string
  status: string
  message: string
  transaction: string
  trxref: string
}

// Declare global Paystack handler type
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string
        email: string
        amount: number
        currency: string
        ref: string
        metadata?: Record<string, any>
        callback: (response: PaystackSuccessResponse) => void
        onClose: () => void
      }) => {
        openIframe: () => void
      }
    }
  }
}

// Generate unique payment reference
export function generateReference(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `CW_${timestamp}_${random}`
}

// Load Paystack script
let paystackScriptLoaded = false
let paystackScriptLoading = false
const loadCallbacks: (() => void)[] = []

export function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (paystackScriptLoaded) {
      resolve()
      return
    }

    if (paystackScriptLoading) {
      loadCallbacks.push(resolve)
      return
    }

    paystackScriptLoading = true

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true

    script.onload = () => {
      paystackScriptLoaded = true
      paystackScriptLoading = false
      resolve()
      loadCallbacks.forEach((cb) => cb())
      loadCallbacks.length = 0
    }

    script.onerror = () => {
      paystackScriptLoading = false
      reject(new Error('Failed to load Paystack script'))
    }

    document.body.appendChild(script)
  })
}

// Initialize and open Paystack popup
export async function initializePayment(config: PaystackConfig): Promise<void> {
  await loadPaystackScript()

  if (!window.PaystackPop) {
    throw new Error('Paystack not loaded')
  }

  const handler = window.PaystackPop.setup({
    key: config.publicKey,
    email: config.email,
    amount: config.amount,
    currency: config.currency,
    ref: config.reference,
    metadata: config.metadata,
    callback: config.onSuccess,
    onClose: config.onCancel,
  })

  handler.openIframe()
}

// Convert ZAR to kobo (smallest unit - cents for ZAR)
export function toSmallestUnit(amount: number): number {
  return Math.round(amount * 100)
}

// Convert from smallest unit back to ZAR
export function fromSmallestUnit(amount: number): number {
  return amount / 100
}

// Get Paystack public key from environment
export function getPaystackPublicKey(): string {
  const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  if (!key) {
    console.warn('Paystack public key not configured. Using test key placeholder.')
    return 'pk_test_placeholder'
  }
  return key
}
